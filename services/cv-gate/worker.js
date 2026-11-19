/**
 * cv.andersein.com — serves my CV to people, not to bots, and lets me know.
 *
 *   GET  /                      bridge page: Turnstile checks the visitor, who
 *                               picks Spanish or English
 *   POST /cv                    verifies the token, sends me a notification and
 *                               redirects to a signed link that lasts 10 minutes
 *   GET  /cv/<lang>/<exp>/<sig> the PDF, only with a valid signature
 *   GET  /admin                 private upload page (needs ADMIN_TOKEN)
 *   PUT  /admin/cv/<lang>       replaces a PDF in KV (Authorization: Bearer ADMIN_TOKEN)
 *
 * The PDFs are not in any public repository: they live in a KV namespace.
 *
 * Bindings and settings:
 *   CV_STORE            KV namespace with the PDFs (keys cv-es, cv-en)
 *   TURNSTILE_SITEKEY   public site key of the Turnstile widget
 *   TURNSTILE_SECRET    secret key of the widget                      (secret)
 *   SIGNING_KEY         random string used to sign the PDF links       (secret)
 *   ADMIN_TOKEN         random string for the upload page              (secret)
 *   NTFY_TOPIC          ntfy.sh topic for push notifications, optional (secret)
 *   TELEGRAM_TOKEN, TELEGRAM_CHAT   Telegram bot instead of / besides ntfy, optional
 *   CONTACT_EMAIL       shown if the check fails
 */

const LINK_TTL_SECONDS = 600;
const MAX_PDF_BYTES = 10 * 1024 * 1024;
const SITEVERIFY = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';
const LANGS = {
  es: { label: 'Español', file: 'Ander-Sein-CV.pdf' },
  en: { label: 'English', file: 'Ander-Sein-CV-EN.pdf' },
};

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const { pathname } = url;
    const method = request.method;
    try {
      if (pathname === '/robots.txt') return text('User-agent: *\nDisallow: /\n');
      if (pathname === '/' && method === 'GET') return bridgePage(env, url);
      if (pathname === '/cv' && method === 'POST') return await checkVisitor(request, env, ctx, url);
      if (pathname.startsWith('/cv/') && method === 'GET') return await servePdf(url, env);
      if (pathname === '/admin' && method === 'GET') return adminPage();
      if (pathname.startsWith('/admin/cv/') && method === 'PUT') return await uploadPdf(request, env, pathname);
      return text('No encontrado', 404);
    } catch (error) {
      console.error(error);
      return text('Algo ha fallado. Inténtalo de nuevo en un rato.', 500);
    }
  },
};

// -- 1. bridge page -----------------------------------------------------------

function bridgePage(env, url, failed = false) {
  const preset = LANGS[url.searchParams.get('lang')] ? url.searchParams.get('lang') : '';
  const from = (url.searchParams.get('from') || '').slice(0, 80);
  const contact = env.CONTACT_EMAIL || '';
  const mail = contact ? `<a href="mailto:${contact}">${contact}</a>` : '';
  const buttons = Object.entries(LANGS)
    .map(([code, { label }]) => `<button type="submit" name="lang" value="${code}" disabled>${label}</button>`)
    .join('');

  const html = `<!doctype html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow">
<title>CV · Ander Sein</title>
<script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer></script>
<style>
  :root { color-scheme: dark; }
  body { margin: 0; min-height: 100vh; display: grid; place-items: center; background: #060D1B;
         color: #E6EDF7; font: 16px/1.6 Inter, system-ui, -apple-system, Segoe UI, sans-serif; }
  main { padding: 32px 24px; max-width: 420px; text-align: center; }
  .mono { font: 600 12px/1 "JetBrains Mono", ui-monospace, monospace; letter-spacing: .14em; color: #22D3EE; }
  h1 { font-size: 26px; margin: 12px 0 8px; }
  p { color: #A3B3C9; margin: 0 0 22px; }
  a { color: #22D3EE; }
  .langs { display: flex; gap: 12px; justify-content: center; margin-bottom: 18px; }
  button { font: 600 15px/1 Inter, system-ui, sans-serif; padding: 13px 22px; border-radius: 10px; cursor: pointer;
           border: 1px solid #22D3EE; background: transparent; color: #E6EDF7; transition: background .2s, opacity .2s; }
  button:hover:not(:disabled) { background: rgba(34, 211, 238, .12); }
  button:disabled { opacity: .35; cursor: wait; }
  .cf-turnstile { display: flex; justify-content: center; }
  .note { font-size: 13px; min-height: 20px; margin: 0; }
</style>
</head>
<body>
<main>
  <div class="mono">ANDER SEIN · CV</div>
  <h1 id="title">${failed ? 'No he podido comprobarlo' : 'Mi CV'}</h1>
  ${
    failed
      ? `<p>Recarga la página para intentarlo otra vez${mail ? `, o escríbeme a ${mail} y te lo mando` : ''}.</p>`
      : `<p>¿En qué idioma lo quieres?</p>
  <form id="go" method="POST" action="/cv">
    <input type="hidden" name="from" value="${escapeHtml(from)}">
    <input type="hidden" name="token" id="token">
    <div class="langs">${buttons}</div>
    <div class="cf-turnstile" data-sitekey="${env.TURNSTILE_SITEKEY}" data-callback="onPass" data-error-callback="onFail"
      data-expired-callback="onExpired" data-theme="dark" data-language="es" data-appearance="interaction-only"></div>
    <p class="note" id="note">Compruebo que no eres un robot…</p>
  </form>`
  }
  <noscript><p>Para abrir el CV necesito JavaScript${mail ? `, o escríbeme a ${mail}` : ''}.</p></noscript>
</main>
<script>
  const preset = ${JSON.stringify(preset)};
  const buttons = () => document.querySelectorAll('.langs button');
  function onPass(token) {
    document.getElementById('token').value = token;
    document.getElementById('note').textContent = '';
    buttons().forEach((b) => (b.disabled = false));
    if (preset) document.querySelector('.langs button[value="' + preset + '"]').click();
  }
  function onExpired() { buttons().forEach((b) => (b.disabled = true)); }
  function onFail() {
    document.getElementById('note').textContent = 'No he podido comprobarlo. Recarga la página para intentarlo otra vez.';
  }
  // Coming back with the browser's back button: the token was already used.
  addEventListener('pageshow', (event) => { if (event.persisted) location.reload(); });
</script>
</body>
</html>`;
  return new Response(html, {
    status: failed ? 403 : 200,
    headers: { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'no-store', 'x-robots-tag': 'noindex' },
  });
}

// -- 2. check the visitor -----------------------------------------------------

async function checkVisitor(request, env, ctx, url) {
  const form = await request.formData();
  const lang = LANGS[form.get('lang')] ? String(form.get('lang')) : 'es';
  const from = String(form.get('from') || '').slice(0, 80);
  const ip = request.headers.get('cf-connecting-ip') || '';

  const verdict = await fetch(SITEVERIFY, {
    method: 'POST',
    body: new URLSearchParams({ secret: env.TURNSTILE_SECRET, response: String(form.get('token') || ''), remoteip: ip }),
  }).then((r) => r.json());

  if (!verdict.success || verdict.hostname !== url.hostname) {
    console.log('turnstile rejected', JSON.stringify(verdict['error-codes'] || []), verdict.hostname);
    return bridgePage(env, url, true);
  }

  ctx.waitUntil(notify(env, describeVisit(request, lang, from)));

  const exp = Math.floor(Date.now() / 1000) + LINK_TTL_SECONDS;
  const sig = await sign(env.SIGNING_KEY, `${lang}.${exp}`);
  return new Response(null, { status: 303, headers: { location: `/cv/${lang}/${exp}/${sig}`, 'cache-control': 'no-store' } });
}

function describeVisit(request, lang, from) {
  const cf = request.cf || {};
  const place = [cf.city, cf.country].filter(Boolean).join(', ') || 'lugar desconocido';
  const ua = request.headers.get('user-agent') || '';
  const device = /Mobi|Android|iPhone/i.test(ua) ? 'móvil' : 'ordenador';
  const via = from ? `Llega desde ${from}` : 'Sin origen (enlace directo o privado)';
  const when = new Date().toLocaleString('es-ES', { timeZone: 'Europe/Madrid', dateStyle: 'short', timeStyle: 'short' });
  return {
    title: `Han abierto tu CV (${lang.toUpperCase()})`,
    body: `${place} · ${device}\n${via}\n${when}`,
  };
}

async function notify(env, { title, body }) {
  const jobs = [];
  if (env.NTFY_TOPIC) {
    jobs.push(
      fetch(`https://ntfy.sh/${env.NTFY_TOPIC}`, {
        method: 'POST',
        headers: { title: encodeHeader(title), tags: 'page_facing_up' },
        body,
      }),
    );
  }
  if (env.TELEGRAM_TOKEN && env.TELEGRAM_CHAT) {
    jobs.push(
      fetch(`https://api.telegram.org/bot${env.TELEGRAM_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ chat_id: env.TELEGRAM_CHAT, text: `📄 ${title}\n${body}` }),
      }),
    );
  }
  const results = await Promise.allSettled(jobs);
  for (const r of results) {
    if (r.status === 'rejected') console.log('notification failed', String(r.reason));
    else if (!r.value.ok) console.log('notification failed', r.value.status);
  }
}

// -- 3. the PDF ---------------------------------------------------------------

async function servePdf(url, env) {
  const [, , lang, exp, sig] = url.pathname.split('/');
  const now = Math.floor(Date.now() / 1000);
  const valid =
    LANGS[lang] && Number(exp) > now && Number(exp) <= now + LINK_TTL_SECONDS && (await verify(env.SIGNING_KEY, `${lang}.${exp}`, sig));
  if (!valid) {
    // Expired or tampered link: back to the bridge page for a new one.
    return new Response(null, { status: 303, headers: { location: '/' } });
  }

  const pdf = await env.CV_STORE.get(`cv-${lang}`, { type: 'arrayBuffer', cacheTtl: 3600 });
  if (!pdf) return text('No he podido cargar el CV ahora mismo. Inténtalo en un rato.', 502);

  return new Response(pdf, {
    headers: {
      'content-type': 'application/pdf',
      'content-disposition': `inline; filename="${LANGS[lang].file}"`,
      'cache-control': 'private, no-store',
      'x-robots-tag': 'noindex, nofollow',
    },
  });
}

// -- 4. upload (only me) ------------------------------------------------------

async function uploadPdf(request, env, pathname) {
  const lang = pathname.split('/')[3];
  const auth = request.headers.get('authorization') || '';
  if (!env.ADMIN_TOKEN || !(await sameText(auth, `Bearer ${env.ADMIN_TOKEN}`))) return json({ ok: false, error: 'unauthorized' }, 401);
  if (!LANGS[lang]) return json({ ok: false, error: 'unknown language' }, 400);

  const bytes = await request.arrayBuffer();
  if (bytes.byteLength > MAX_PDF_BYTES) return json({ ok: false, error: 'too large' }, 413);
  if (!isPdf(bytes)) return json({ ok: false, error: 'not a PDF' }, 415);

  await env.CV_STORE.put(`cv-${lang}`, bytes, { metadata: { bytes: bytes.byteLength, uploaded: new Date().toISOString() } });
  return json({ ok: true, lang, bytes: bytes.byteLength });
}

function adminPage() {
  const rows = Object.entries(LANGS)
    .map(([code, { label }]) => `<label>${label} <input type="file" accept="application/pdf" data-lang="${code}"></label>`)
    .join('');
  const html = `<!doctype html>
<html lang="es"><head><meta charset="utf-8"><meta name="robots" content="noindex, nofollow">
<meta name="viewport" content="width=device-width, initial-scale=1"><title>Subir CV</title>
<style>
  body { font: 15px/1.6 system-ui, sans-serif; background: #060D1B; color: #E6EDF7; max-width: 460px; margin: 60px auto; padding: 0 20px; }
  label { display: block; margin: 14px 0; } input { display: block; margin-top: 6px; color: #A3B3C9; width: 100%; }
  button { padding: 10px 18px; border-radius: 8px; border: 1px solid #22D3EE; background: transparent; color: #E6EDF7; cursor: pointer; }
  pre { color: #22D3EE; white-space: pre-wrap; }
</style></head>
<body>
<h1>Subir CV</h1>
<label>Clave <input type="password" id="token" autocomplete="off"></label>
${rows}
<button id="send">Subir</button>
<pre id="out"></pre>
<script>
  document.getElementById('send').onclick = async () => {
    const out = document.getElementById('out');
    const token = document.getElementById('token').value;
    out.textContent = '';
    for (const input of document.querySelectorAll('input[type=file]')) {
      const file = input.files[0];
      if (!file) continue;
      const res = await fetch('/admin/cv/' + input.dataset.lang, { method: 'PUT', headers: { authorization: 'Bearer ' + token }, body: file });
      out.textContent += input.dataset.lang + ': ' + res.status + ' ' + (await res.text()) + '\\n';
    }
    if (!out.textContent) out.textContent = 'Elige al menos un PDF.';
  };
</script>
</body></html>`;
  return new Response(html, { headers: { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'no-store', 'x-robots-tag': 'noindex' } });
}

// -- helpers --------------------------------------------------------------------

const isPdf = (bytes) => new TextDecoder().decode(bytes.slice(0, 5)) === '%PDF-';

async function hmacKey(secret) {
  return crypto.subtle.importKey('raw', new TextEncoder().encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign', 'verify']);
}

async function sign(secret, message) {
  const mac = await crypto.subtle.sign('HMAC', await hmacKey(secret), new TextEncoder().encode(message));
  return base64url(new Uint8Array(mac));
}

async function verify(secret, message, signature) {
  try {
    const mac = Uint8Array.from(atob(signature.replace(/-/g, '+').replace(/_/g, '/')), (c) => c.charCodeAt(0));
    return crypto.subtle.verify('HMAC', await hmacKey(secret), mac, new TextEncoder().encode(message));
  } catch {
    return false;
  }
}

// Constant-time comparison through HMAC, so the admin token cannot be guessed byte by byte.
async function sameText(a, b) {
  const key = await hmacKey('compare');
  const [x, y] = await Promise.all([a, b].map((v) => crypto.subtle.sign('HMAC', key, new TextEncoder().encode(v))));
  const ua = new Uint8Array(x);
  const ub = new Uint8Array(y);
  let diff = 0;
  for (let i = 0; i < ua.length; i++) diff |= ua[i] ^ ub[i];
  return diff === 0;
}

function base64url(bytes) {
  return btoa(String.fromCharCode(...bytes)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

// ntfy reads headers as Latin-1; RFC 2047 keeps accents intact.
function encodeHeader(value) {
  return /^[\x20-\x7E]*$/.test(value) ? value : `=?UTF-8?B?${btoa(String.fromCharCode(...new TextEncoder().encode(value)))}?=`;
}

function escapeHtml(value) {
  return value.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
}

function text(body, status = 200) {
  return new Response(body, { status, headers: { 'content-type': 'text/plain; charset=utf-8' } });
}

function json(body, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json' } });
}
