# Rkyves Website

Professional multi-page marketing website for **Rkyves** — a technology and digital solutions company.

## Pages

- **Home** — Brand hero, surface→depth story, work preview, services, process, CTA
- **Services** — Full catalog with deep anchors
- **Work** — Client index and case studies (`/work/[slug]`)
- **Process** — Discovery → build → launch → care
- **Pricing** — Starter / Growth / Operations packages
- **About** — Company story, vision, ecosystem
- **Contact** — Inquiry form, booking embed, WhatsApp, email
- **Privacy / Terms** — Legal pages

## Tech Stack

- [Next.js](https://nextjs.org/) 16 (App Router)
- [Tailwind CSS](https://tailwindcss.com/) v4
- [TypeScript](https://www.typescriptlang.org/)
- [Resend](https://resend.com/) — contact form emails
- [Lucide React](https://lucide.dev/) — icons
- [@vercel/analytics](https://vercel.com/analytics) — web analytics

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Copy the example env file and fill in your values:

```bash
cp .env.example .env.local
```

| Variable | Description |
|----------|-------------|
| `RESEND_API_KEY` | API key from [resend.com](https://resend.com) |
| `CONTACT_EMAIL` | Where form submissions are delivered |
| `RESEND_FROM_EMAIL` | (Optional) Verified sender in Resend |
| `NEXT_PUBLIC_SITE_URL` | Production URL (sitemap, metadata) |
| `NEXT_PUBLIC_CAL_URL` | (Optional) Cal.com / Calendly embed URL |
| `LEAD_WEBHOOK_URL` | (Optional) CRM / Make / Zapier webhook |
| `NEXT_PUBLIC_GA_ID` | (Optional) Google Analytics 4 measurement ID |
| `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` | (Optional) Plausible domain |

### 3. Edit content

Site copy lives in typed modules under [`lib/content/`](lib/content/):

- `site.ts` — name, contact, nav
- `services.ts` — service catalog
- `cases.ts` — case studies
- `pricing.ts` — packages
- `process.ts` — engagement steps
- `home.ts` — home / about copy
- `testimonials.ts` — real quotes only (empty until you have them)

### 4. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Contact Form Setup (Resend)

1. Create a free account at [resend.com](https://resend.com)
2. Generate an API key and add it to `.env.local`
3. For production, verify your domain and set `RESEND_FROM_EMAIL`
4. Without an API key, the form still renders but returns a setup message
5. Optional: set `LEAD_WEBHOOK_URL` to forward leads to a CRM or spreadsheet

## Deploy on Vercel

1. Push the project to GitHub
2. Import the repo at [vercel.com](https://vercel.com)
3. Add environment variables in the Vercel dashboard
4. Deploy

## Project Structure

```
app/                 # App Router pages + API
components/          # UI components
lib/content/         # Typed marketing content
lib/validations.ts   # Contact form schema
lib/analytics.ts     # Client event helpers
public/              # Logos and static assets
```
