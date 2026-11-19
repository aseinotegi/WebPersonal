# cv-gate

Small Cloudflare Worker behind **cv.andersein.com**. The "Ver CV" button of the site points here.

1. `GET /` shows a bridge page with Cloudflare Turnstile (usually invisible) where the visitor picks Spanish or English.
2. `POST /cv` checks the token with Turnstile, sends me a push notification (ntfy or Telegram: city, country, device and where the visitor came from) and redirects to a signed link that lasts 10 minutes.
3. `GET /cv/<lang>/<exp>/<sig>` serves the PDF only if the HMAC signature and the expiry are valid.

The PDFs are not in this repository: they live in a Workers KV namespace (`cv-es`, `cv-en`). To replace them, open `/admin`, enter the `ADMIN_TOKEN` and pick the new files.

No dependencies, one file. Settings are listed at the top of `worker.js`.

```bash
npx wrangler deploy                       # from this folder
npx wrangler secret put TURNSTILE_SECRET  # and SIGNING_KEY, ADMIN_TOKEN, NTFY_TOPIC…
```
