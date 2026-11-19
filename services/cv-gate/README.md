# cv-gate

Small Cloudflare Worker behind **cv.andersein.com**. The "Ver CV" button of the site points here.

1. `GET /` shows a bridge page with Cloudflare Turnstile (usually invisible).
2. `POST /cv` checks the token with Turnstile, sends me a push notification (ntfy or Telegram: city, country, device and where the visitor came from) and redirects to a signed link that lasts 10 minutes.
3. `GET /cv/<lang>/<exp>/<sig>` serves the PDF only if the HMAC signature and the expiry are valid.

The PDF is not in this repository. The Worker downloads it from a Drive file whose id is a secret and keeps it in the edge cache for an hour, so updating the Drive file updates the CV.

No dependencies, one file. Settings are listed at the top of `worker.js`.

```bash
npx wrangler deploy                       # from this folder
npx wrangler secret put TURNSTILE_SECRET  # and SIGNING_KEY, CV_FILE_ES, NTFY_TOPIC…
```
