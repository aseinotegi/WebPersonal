# cv-gate

Cloudflare Worker behind **cv.andersein.com**. The "Ver CV" button of the site points here.

- `GET /` page with Turnstile where you pick Spanish or English.
- `POST /cv` checks the Turnstile token, sends me a push notification with [ntfy](https://ntfy.sh) (city, country, device and where the visitor came from) and redirects to a signed link that lasts 10 minutes.
- `GET /cv/<lang>/<exp>/<sig>` the PDF, only with a valid HMAC signature.
- `/admin` page to upload a new version of the CV.

The PDFs are not in the repo, they live in Workers KV (`cv-es`, `cv-en`).

```bash
npx wrangler deploy
npx wrangler secret put TURNSTILE_SECRET   # also SIGNING_KEY, ADMIN_TOKEN, NTFY_TOPIC
```
