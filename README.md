# Homely - Property & Tenancy Management

A quiet, direct property management platform for landlords and residents designed with a minimal, warm architectural aesthetic.

## Features

- **Landlord Portal**: Manage properties, track lease agreements, split utility invoices, view Schedule E tax category expense breakdowns, and handle maintenance tickets.
- **Tenant Portal**: View lease details, pay rent online, submit repair requests with visual attachments, and chat directly with property managers.
- **Alcove Architectural Design**: Warm natural palette (`#faf8f5`), serene serif typography (*Playfair Display*), clean responsive navigation, and direct non-commercial copy.

## Live Demo

Once deployed on GitHub Pages, visit:
`https://<YOUR_USERNAME>.github.io/homely/`

## Project Structure

```
.
├── index.html            # Main SPA entry point
├── css/
│   └── style.css         # Global design tokens and Alcove theme
├── js/
│   ├── app.js            # Main router & navbar coordinator
│   ├── store.js          # Central state & data persistence
│   ├── components.js     # Shared UI widgets & modal dialogs
│   └── views/
│       ├── publicViews.js # Landing, About & Contact views
│       ├── ownerView.js   # Landlord dashboard & property manager tabs
│       └── tenantView.js  # Resident dashboard & payment tabs
└── assets/               # Architecture photo assets
```

## Local Setup

To run locally without build dependencies:

```bash
python3 -m http.server 8000
```
Open `http://localhost:8000/` in your browser.
