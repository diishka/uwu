# uwu.uz — creepy kawaii mystery
`cp .env.example .env && docker compose up` → frontend :5173, API :8000, docs :8000/docs (disabled when `APP_ENV=production`).
Local: backend `pip i -r requirements.txt; alembic upgrade head; python -m app.seed; uvicorn app.main:app` · frontend `npm i && npm run dev`. Tests: `cd backend && pytest`.
**Story graph** is documented at the top of `backend/app/seed.py`; answers exist only there (salted SHA-256 in DB), never in the frontend. The 17 rewards spell the final code.
Dread grows with time on site and secrets found (`useDread` in `frontend/src/api.ts`): pastel cyber → red/grey, scanlines, vignette, corrupted text, more eyes. No jumpscares.
Production: put Nginx + HTTPS in front (`/` → built frontend, `/api` incl. websocket → backend:8000) and set `APP_ENV=production`, `ANSWER_SALT`, `CORS_ORIGINS`.

## Production (HTTPS)
1. DNS: uwu.uz → server. `certbot certonly --webroot -w /var/www/certbot -d uwu.uz` (start nginx on :80 first, or use `--standalone` once).
2. `.env`: `POSTGRES_PASSWORD`, `ANSWER_SALT` (long random; changing it invalidates stored hashes → re-run seed). 
3. `docker compose -f docker-compose.prod.yml up -d --build` — Nginx serves the build, proxies `/api` (incl. WebSocket) to FastAPI; docs are off.
Extras: hidden doors `/secret/01…17`, Konami code, `ascii` in /terminal, diary API (`/api/diary`) unlocking with progress.
