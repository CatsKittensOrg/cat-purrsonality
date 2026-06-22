# Petsonality Deployment Guide

## My recommendation

Use Vercel first.

Vercel and Netlify are two separate hosting companies. You only need one account. For this app, Vercel is my pick because it is very smooth for React/Vite apps, custom domains, previews, and future upgrades. Netlify is also excellent, and this project is prepared for both.

## Suggested public URL

Use your main app domain:

```text
petsonality.app
```

You can also point `purrsonality.app` to the same project later as a cat-focused doorway.

## Vercel settings

When importing the project, use:

```text
Framework Preset: Vite
Build Command: pnpm run build
Output Directory: dist
Install Command: pnpm install
```

This project includes `vercel.json`, so Vercel should detect these settings.

After deployment:

1. Open the Vercel project.
2. Go to Settings > Domains.
3. Add `petsonality.app`.
4. Vercel will show the DNS record to add wherever the domain is managed.

Most likely DNS record:

```text
Type: A
Name: @
Value: 76.76.21.21
```

Use the exact value Vercel shows.

## Netlify settings

If using Netlify instead:

```text
Build command: pnpm run build
Publish directory: dist
```

This project includes `netlify.toml`, including the redirect needed for a single-page app.

After deployment:

1. Open the Netlify site.
2. Go to Domain management.
3. Add `petsonality.app`.
4. Netlify will show the DNS record to add wherever the domain is managed.

## Important limitation right now

The current sign-up/login and paid report unlock are browser-local prototypes. They are good for demonstrating the product, but they are not real cloud accounts or real payments yet.

Before charging real users, add:

- Real account database
- Real authentication
- Payment provider
- Privacy policy
- Terms of service
- Support/contact page

For web payments, use Stripe. For iPhone App Store payments, use Apple In-App Purchase.
