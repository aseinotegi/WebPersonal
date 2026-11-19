/**
 * cv.andersein.com: my CV for people, not for bots, and a notification for me.
 *
 *   GET  /                      bridge page, Turnstile + choose Spanish or English
 *   POST /cv                    checks the Turnstile token, notifies me and redirects
 *                               to a signed link that lasts 10 minutes
 *   GET  /cv/<lang>/<exp>/<sig> the PDF
 *   GET  /admin                 upload page for new versions of the CV
 *   PUT  /admin/cv/<lang>       stores a PDF in KV (Authorization: Bearer ADMIN_TOKEN)
 *
 * Env: CV_STORE (KV), TURNSTILE_SITEKEY, TURNSTILE_SECRET, SIGNING_KEY,
 * ADMIN_TOKEN, NTFY_TOPIC, CONTACT_EMAIL.
 */

const LINK_TTL = 600; // seconds
const MAX_PDF_SIZE = 10 * 1024 * 1024;
const LANGS = {
  es: 'Ander-Sein-CV.pdf',
  en: 'Ander-Sein-CV-EN.pdf',
};

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const path = url.pathname;
    const method = request.method;

    try {
      if (path === '/robots.txt') {
        return textResponse('User-agent: *\nDisallow: /\n');
      }
      if (path === '/' && method === 'GET') {
        return showBridge(env, url);
      }
      if (path === '/cv' && method === 'POST') {
        return await checkVisitor(request, env, ctx, url);
      }
      if (path.startsWith('/cv/') && method === 'GET') {
        return await sendPdf(path, env);
      }
      if (path === '/admin' && method === 'GET') {
        return htmlResponse(adminHtml());
      }
      if (path.startsWith('/admin/cv/') && method === 'PUT') {
        return await uploadPdf(request, env, path);
      }
      return textResponse('No encontrado', 404);
    } catch (err) {
      console.error(err);
      return textResponse('Algo ha fallado. Inténtalo de nuevo en un rato.', 500);
    }
  },
};

function showBridge(env, url, failed = false) {
  const lang = url.searchParams.get('lang');
  const html = bridgeHtml({
    siteKey: env.TURNSTILE_SITEKEY,
    contact: env.CONTACT_EMAIL,
    from: (url.searchParams.get('from') || '').slice(0, 80),
    preset: LANGS[lang] ? lang : '',
    failed,
  });
  return htmlResponse(html, failed ? 403 : 200);
}

async function checkVisitor(request, env, ctx, url) {
  const form = await request.formData();
  const lang = LANGS[form.get('lang')] ? form.get('lang') : 'es';
  const from = String(form.get('from') || '').slice(0, 80);

  const check = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    body: new URLSearchParams({
      secret: env.TURNSTILE_SECRET,
      response: String(form.get('token') || ''),
      remoteip: request.headers.get('cf-connecting-ip') || '',
    }),
  });
  const result = await check.json();

  if (!result.success || result.hostname !== url.hostname) {
    console.log('turnstile failed', result['error-codes'], result.hostname);
    return showBridge(env, url, true);
  }

  ctx.waitUntil(notifyMe(env, request, lang, from));

  const expires = Math.floor(Date.now() / 1000) + LINK_TTL;
  const signature = await sign(env.SIGNING_KEY, `${lang}.${expires}`);
  return new Response(null, {
    status: 303,
    headers: { location: `/cv/${lang}/${expires}/${signature}`, 'cache-control': 'no-store' },
  });
}

async function notifyMe(env, request, lang, from) {
  if (!env.NTFY_TOPIC) return;

  const cf = request.cf || {};
  const place = [cf.city, cf.country].filter(Boolean).join(', ') || 'lugar desconocido';
  const userAgent = request.headers.get('user-agent') || '';
  const device = /Mobi|Android|iPhone/i.test(userAgent) ? 'móvil' : 'ordenador';
  const origin = from ? `Llega desde ${from}` : 'Sin origen (enlace directo o privado)';
  const time = new Date().toLocaleString('es-ES', { timeZone: 'Europe/Madrid', dateStyle: 'short', timeStyle: 'short' });

  const res = await fetch(`https://ntfy.sh/${env.NTFY_TOPIC}`, {
    method: 'POST',
    headers: {
      // ntfy reads header values as Latin-1, so the title goes MIME-encoded
      title: mimeEncode(`Han abierto tu CV (${lang.toUpperCase()})`),
      tags: 'page_facing_up',
    },
    body: `${place} · ${device}\n${origin}\n${time}`,
  });
  if (!res.ok) console.log('ntfy failed', res.status);
}

async function sendPdf(path, env) {
  const [, , lang, expires, signature] = path.split('/');
  const now = Math.floor(Date.now() / 1000);

  const inTime = Number(expires) > now && Number(expires) <= now + LINK_TTL;
  const signed = inTime && LANGS[lang] && (await verify(env.SIGNING_KEY, `${lang}.${expires}`, signature));
  if (!signed) {
    // expired or edited link: back to the start for a new one
    return new Response(null, { status: 303, headers: { location: '/' } });
  }

  const pdf = await env.CV_STORE.get(`cv-${lang}`, { type: 'arrayBuffer', cacheTtl: 3600 });
  if (!pdf) {
    return textResponse('No he podido cargar el CV ahora mismo. Inténtalo en un rato.', 502);
  }

  return new Response(pdf, {
    headers: {
      'content-type': 'application/pdf',
      'content-disposition': `inline; filename="${LANGS[lang]}"`,
      'cache-control': 'private, no-store',
      'x-robots-tag': 'noindex, nofollow',
    },
  });
}

async function uploadPdf(request, env, path) {
  const lang = path.split('/')[3];
  const token = (request.headers.get('authorization') || '').replace('Bearer ', '');

  if (!env.ADMIN_TOKEN || !sameString(token, env.ADMIN_TOKEN)) {
    return jsonResponse({ ok: false, error: 'unauthorized' }, 401);
  }
  if (!LANGS[lang]) {
    return jsonResponse({ ok: false, error: 'unknown language' }, 400);
  }

  const pdf = await request.arrayBuffer();
  if (pdf.byteLength > MAX_PDF_SIZE) {
    return jsonResponse({ ok: false, error: 'too large' }, 413);
  }
  if (!isPdf(pdf)) {
    return jsonResponse({ ok: false, error: 'not a PDF' }, 415);
  }

  await env.CV_STORE.put(`cv-${lang}`, pdf, {
    metadata: { bytes: pdf.byteLength, uploaded: new Date().toISOString() },
  });
  return jsonResponse({ ok: true, lang, bytes: pdf.byteLength });
}

// --- helpers ---

function isPdf(buffer) {
  return new TextDecoder().decode(buffer.slice(0, 5)) === '%PDF-';
}

function sameString(a, b) {
  const x = new TextEncoder().encode(a);
  const y = new TextEncoder().encode(b);
  return x.byteLength === y.byteLength && crypto.subtle.timingSafeEqual(x, y);
}

async function hmacKey(secret) {
  const raw = new TextEncoder().encode(secret);
  return crypto.subtle.importKey('raw', raw, { name: 'HMAC', hash: 'SHA-256' }, false, ['sign', 'verify']);
}

async function sign(secret, message) {
  const key = await hmacKey(secret);
  const mac = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(message));
  return toBase64Url(new Uint8Array(mac));
}

async function verify(secret, message, signature) {
  try {
    const key = await hmacKey(secret);
    const mac = fromBase64Url(signature);
    return await crypto.subtle.verify('HMAC', key, mac, new TextEncoder().encode(message));
  } catch {
    return false;
  }
}

function toBase64Url(bytes) {
  return btoa(String.fromCharCode(...bytes)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function fromBase64Url(text) {
  const base64 = text.replace(/-/g, '+').replace(/_/g, '/');
  return Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));
}

function mimeEncode(text) {
  const bytes = new TextEncoder().encode(text);
  return `=?UTF-8?B?${btoa(String.fromCharCode(...bytes))}?=`;
}

function textResponse(body, status = 200) {
  return new Response(body, { status, headers: { 'content-type': 'text/plain; charset=utf-8' } });
}

function jsonResponse(body, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json' } });
}

function htmlResponse(html, status = 200) {
  return new Response(html, {
    status,
    headers: { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'no-store', 'x-robots-tag': 'noindex' },
  });
}

// --- pages ---

const STYLE = `
  :root { color-scheme: dark; }
  body { margin: 0; min-height: 100vh; display: grid; place-items: center; background: #060D1B;
         color: #E6EDF7; font: 16px/1.6 Inter, system-ui, -apple-system, Segoe UI, sans-serif; }
  main { padding: 32px 24px; max-width: 420px; text-align: center; }
  .label { font: 600 12px/1 "JetBrains Mono", ui-monospace, monospace; letter-spacing: .14em; color: #22D3EE; }
  h1 { font-size: 26px; margin: 12px 0 8px; }
  p { color: #A3B3C9; margin: 0 0 22px; }
  a { color: #22D3EE; }
  .langs { display: flex; gap: 12px; justify-content: center; margin-bottom: 18px; }
  button { font: 600 15px/1 Inter, system-ui, sans-serif; padding: 13px 22px; border-radius: 10px; cursor: pointer;
           border: 1px solid #22D3EE; background: transparent; color: #E6EDF7; }
  button:hover:not(:disabled) { background: rgba(34, 211, 238, .12); }
  button:disabled { opacity: .35; cursor: wait; }
  .cf-turnstile { display: flex; justify-content: center; }
  .note { font-size: 13px; min-height: 20px; margin: 0; }
`;

function page(title, body) {
  return `<!doctype html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow">
<title>${title}</title>
<script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer></script>
<style>${STYLE}</style>
</head>
<body>
<main>
${body}
</main>
</body>
</html>`;
}

function bridgeHtml({ siteKey, contact, from, preset, failed }) {
  const mail = contact ? `<a href="mailto:${contact}">${contact}</a>` : '';

  if (failed) {
    const orMail = mail ? `, o escríbeme a ${mail} y te lo mando` : '';
    return page('CV · Ander Sein', `
  <div class="label">ANDER SEIN · CV</div>
  <h1>No he podido comprobarlo</h1>
  <p>Recarga la página para intentarlo otra vez${orMail}.</p>`);
  }

  return page('CV · Ander Sein', `
  <div class="label">ANDER SEIN · CV</div>
  <h1>Mi CV</h1>
  <p>¿En qué idioma lo quieres?</p>
  <form method="POST" action="/cv">
    <input type="hidden" name="from" value="${escapeHtml(from)}">
    <input type="hidden" name="token" id="token">
    <div class="langs">
      <button type="submit" name="lang" value="es" disabled>Español</button>
      <button type="submit" name="lang" value="en" disabled>English</button>
    </div>
    <div class="cf-turnstile" data-sitekey="${siteKey}" data-theme="dark" data-language="es"
      data-appearance="interaction-only" data-callback="onPass" data-error-callback="onFail"
      data-expired-callback="onExpired"></div>
    <p class="note" id="note">Compruebo que no eres un robot…</p>
  </form>
  <noscript><p>Para abrir el CV necesito JavaScript. ${mail}</p></noscript>
  <script>
    const preset = '${preset}';
    const buttons = document.querySelectorAll('.langs button');

    function onPass(token) {
      document.getElementById('token').value = token;
      document.getElementById('note').textContent = '';
      buttons.forEach((b) => (b.disabled = false));
      if (preset) document.querySelector('button[value="' + preset + '"]').click();
    }
    function onExpired() {
      buttons.forEach((b) => (b.disabled = true));
    }
    function onFail() {
      document.getElementById('note').textContent = 'No he podido comprobarlo. Recarga la página.';
    }
    // back button: the token was already used, get a new one
    addEventListener('pageshow', (e) => { if (e.persisted) location.reload(); });
  </script>`);
}

function adminHtml() {
  return `<!doctype html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="robots" content="noindex, nofollow">
<title>Subir CV</title>
<style>
  body { font: 15px/1.6 system-ui, sans-serif; background: #060D1B; color: #E6EDF7; max-width: 460px; margin: 60px auto; padding: 0 20px; }
  label { display: block; margin: 14px 0; }
  input { display: block; margin-top: 6px; width: 100%; }
  pre { color: #22D3EE; }
</style>
</head>
<body>
<h1>Subir CV</h1>
<label>Clave <input type="password" id="token"></label>
<label>Español <input type="file" accept="application/pdf" data-lang="es"></label>
<label>English <input type="file" accept="application/pdf" data-lang="en"></label>
<button id="send">Subir</button>
<pre id="out"></pre>
<script>
  document.getElementById('send').onclick = async () => {
    const out = document.getElementById('out');
    const token = document.getElementById('token').value;
    out.textContent = '';
    for (const input of document.querySelectorAll('input[type=file]')) {
      if (!input.files[0]) continue;
      const res = await fetch('/admin/cv/' + input.dataset.lang, {
        method: 'PUT',
        headers: { authorization: 'Bearer ' + token },
        body: input.files[0],
      });
      out.textContent += input.dataset.lang + ': ' + res.status + ' ' + (await res.text()) + '\\n';
    }
  };
</script>
</body>
</html>`;
}

function escapeHtml(text) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
