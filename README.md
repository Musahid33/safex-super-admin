# SAFEX Super Admin Control Plane

Internal-only administration UI for the SAFEX multi-tenant safety management platform. This repository contains the Super Admin portal only; Company Admin and employee operations belong to the separate Company Portal.

## Local development

```bash
npm install
npm run dev
```

Open `http://localhost:3000`. Run `npm run typecheck`, `npm run lint` and `npm run build` for validation.

## Demo mode

The experience is frontend-only and uses seeded sample data. Tenant create/publish, drafts, suspend/activate, deletion, plan changes, add-ons, limits and domain details are persisted in browser `localStorage` to demonstrate cross-page flows. No authentication, impersonation session, tenant/database provisioning, billing, email delivery or domain/SSL operations are connected. “Login as Company Admin” is a guarded hand-off to the separate tenant URL; it does not exchange credentials or host the Company Admin portal here.
