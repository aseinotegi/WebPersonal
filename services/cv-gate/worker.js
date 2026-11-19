/**
 * cv.andersein.com — serves my CV to people, not to bots, and lets me know.
 *
 *   GET  /                      bridge page: Cloudflare Turnstile checks the visitor
 *   POST /cv                    verifies the token, sends me a notification and
 *                               redirects to a signed link that lasts 10 minutes
 *   GET  /cv/<lang>/<exp>/<sig> the PDF, only with a valid signature
 *
 * The PDF is not in any public repository. The Worker downloads it from a Drive
 * file whose id is a secret and keeps it in the edge cache for an hour.
 *
 * Settings (Worker variables and secrets):
 *   TURNSTILE_SITEKEY   public site key of the Turnstile widget
 *   TURNSTILE_SECRET    secret key of the widget                      (secret)
 *   SIGNING_KEY         random string used to sign the PDF links       (secret)
 *   CV_FILE_ES          Drive file id of the Spanish CV                (secret)
 *   CV_FILE_EN          Drive file id of the English CV, optional      (secret)
 *   NTFY_TOPIC          ntfy.sh topic for push notifications, optional (secret)
 *   TELEGRAM_TOKEN, TELEGRAM_CHAT   Telegram bot instead of / besides ntfy, optional
 *   CONTACT_EMAIL       shown if the check fails
 */

const LINK_TTL_SECONDS = 600;
const PDF_CACHE_SECONDS = 3600;
const SITEVERIFY = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    try {
      if (url.pathname === '/robots.txt') return text('User-agent: *\nDisallow: /\n');
      if (url.pathname === '/' && request.method === 'GET') return bridgePage(env, url);
      if (url.pathname === '/cv' && request.method === 'POST') return await checkVisitor(request, env, ctx, url);
      if (url.pathname.startsWith('/cv/') && request.method === 'GET') return await servePdf(url, env, ctx);
      return text('No encontrado', 404);
    } catch (error) {
      console.error(error);
      return text('Algo ha fallado. Inténtalo de nuevo en un rato.', 500);
    }
  },
};

// -- 1. bridge page -----------------------------------------------------------

function bridgePage(env, url, failed = false) {
  const lang = pickLang(url.searchParams.get('lang'), env);
  const from = (url.searchParams.get('from') || '').slice(0, 80);
  const contact = env.CONTACT_EMAIL || '';
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
  p { color: #A3B3C9; margin: 0 0 20px; }
  .cf-turnstile { display: flex; justify-content: center; min-height: 0; }
  a { color: #22D3EE; }
  .dots::after { content: ''; animation: dots 1.2s steps(4) infinite; }
  @keyframes dots { 0% { content: ''; } 25% { content: '.'; } 50% { content: '..'; } 75% { content: '...'; } }
</style>
</head>
<body>
<main>
  <div class="mono">ANDER SEIN · CV</div>
  <h1 id="title">${failed ? 'No he podido comprobarlo' : 'Un segundo'}</h1>
  <p id="msg">${
    failed
      ? `Recarga la página para intentarlo otra vez${contact ? `, o escríbeme a <a href="mailto:${contact}">${contact}</a> y te lo mando` : ''}.`
      : 'Compruebo que no eres un robot y te abro el CV<span class="dots"></span>'
  }</p>
  <form id="go" method="POST" action="/cv">
    <input type="hidden" name="lang" value="${lang}">
    <input type="hidden" name="from" value="${escapeHtml(from)}">
    <input type="hidden" name="token" id="token">
    ${failed ? '' : `<div class="cf-turnstile" data-sitekey="${env.TURNSTILE_SITEKEY}" data-callback="onPass"
      data-error-callback="onFail" data-theme="dark" data-language="es" data-appearance="interaction-only"></div>`}
  </form>
  <noscript><p>Para abrir el CV necesito JavaScript${contact ? `, o escríbeme a <a href="mailto:${contact}">${contact}</a>` : ''}.</p></noscript>
</main>
<script>
  function onPass(token) { document.getElementById('token').value = token; document.getElementById('go').submit(); }
  function onFail() {
    document.getElementById('title').textContent = 'No he podido comprobarlo';
    document.getElementById('msg').textContent = 'Recarga la página para intentarlo otra vez.';
  }
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
  const lang = pickLang(form.get('lang'), env);
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
  for (const r of results) if (r.status === 'rejected' || !r.value.ok) console.log('notification failed', r.reason || r.value.status);
}

// -- 3. the PDF ---------------------------------------------------------------

async function servePdf(url, env, ctx) {
  const [, , lang, exp, sig] = url.pathname.split('/');
  const now = Math.floor(Date.now() / 1000);
  const valid =
    fileFor(lang, env) && Number(exp) > now && Number(exp) <= now + LINK_TTL_SECONDS && (await verify(env.SIGNING_KEY, `${lang}.${exp}`, sig));
  if (!valid) {
    // Expired or tampered link: back to the bridge page for a new one.
    return new Response(null, { status: 303, headers: { location: `/?lang=${pickLang(lang, env)}` } });
  }

  const pdf = await loadPdf(lang, env, ctx);
  if (!pdf) return text('No he podido cargar el CV ahora mismo. Inténtalo en un rato.', 502);

  const name = lang === 'en' ? 'Ander-Sein-CV-EN.pdf' : 'Ander-Sein-CV.pdf';
  return new Response(pdf, {
    headers: {
      'content-type': 'application/pdf',
      'content-disposition': `inline; filename="${name}"`,
      'cache-control': 'private, no-store',
      'x-robots-tag': 'noindex, nofollow',
    },
  });
}

async function loadPdf(lang, env, ctx) {
  const cache = caches.default;
  const key = new Request(`https://cv-cache.internal/${lang}/${fileFor(lang, env)}`);
  const hit = await cache.match(key);
  if (hit) return hit.arrayBuffer();

  const id = encodeURIComponent(fileFor(lang, env));
  const res = await fetch(`https://drive.usercontent.google.com/download?id=${id}&export=download&confirm=t`);
  const bytes = res.ok ? await res.arrayBuffer() : null;
  // Drive answers with an HTML page if the file is not shared or does not exist.
  if (!bytes || !isPdf(bytes)) {
    console.log('drive download failed', res.status, res.headers.get('content-type'));
    return null;
  }
  ctx.waitUntil(
    cache.put(key, new Response(bytes, { headers: { 'content-type': 'application/pdf', 'cache-control': `max-age=${PDF_CACHE_SECONDS}` } })),
  );
  return bytes;
}

const isPdf = (bytes) => new TextDecoder().decode(bytes.slice(0, 5)) === '%PDF-';

// -- helpers --------------------------------------------------------------------

function fileFor(lang, env) {
  return lang === 'en' ? env.CV_FILE_EN : lang === 'es' ? env.CV_FILE_ES : undefined;
}

function pickLang(value, env) {
  return value === 'en' && env.CV_FILE_EN ? 'en' : 'es';
}

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
