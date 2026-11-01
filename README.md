# TimeCraft Front

SaaS scheduling frontend. Visual shell seeded from the local Fintech UI canon (Mantine dashboard + i18n + auth layout), branded as **TimeCraft**.

- Live target: https://timecraft.meditum.eu  
- API: `VITE_API_BASE_URL` → https://back.timecraft.meditum.eu  

## Stack

Vite + React 19 + TypeScript + Mantine 7 + React Query + i18next (ru/en) + React Router.

## Develop

```bash
cp .env.example .env
npm install
npm run dev
```

## Production

```bash
npm run build
npm run preview   # vite preview on :3100
# or
npm run serve     # tiny node static server on :3100
```

Nginx can also serve `dist/` directly; proxy `https://timecraft.meditum.eu` → `127.0.0.1:3100` or static root.

## Demo login

Form is prefilled and submits to `POST /v1/auth/login` as:

- Login (`email` field): `demo`
- Password: `demo`

## First UI slice

- Auth shell (split login + language switcher)
- Dashboard shell (sidebar + header)
- Directory pages aligned with Resource + Dimensions API
- Login → real API `POST /v1/auth/login`; “Open shell (preview)” for browsing without backend auth
