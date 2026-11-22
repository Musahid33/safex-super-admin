# SAFEX Super Admin Control Plane

Internal administration UI for the SAFEX multi-tenant safety management platform. This repository contains only the Super Admin experience; it does not include Company Admin or employee operations portals.

## Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`. Production build: `npm run build`, then `npm start`.

## Demo behavior

The interface uses seeded dummy data. Company creation, status changes, add-on selection and deletion are stored in browser `localStorage` so flows can be explored across pages. No API, authentication, tenant provisioning, email delivery, billing or domain/SSL operations are connected. These screens are demonstrations of the internal admin workflow only.
