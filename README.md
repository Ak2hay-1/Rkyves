# Rkyves Website

Professional multi-page marketing website for **Rkyves** — a technology and digital solutions company.

## Pages

- **Home** — Hero, services overview, why Rkyves, approach, CTA
- **Services** — Detailed breakdown of all offerings
- **About** — Company story, vision, and ecosystem
- **Contact** — Contact form, WhatsApp, and email links

## Tech Stack

- [Next.js](https://nextjs.org/) (App Router)
- [Tailwind CSS](https://tailwindcss.com/) v4
- [TypeScript](https://www.typescriptlang.org/)
- [Resend](https://resend.com/) — contact form emails
- [Lucide React](https://lucide.dev/) — icons

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

### 3. Update contact details

Edit [`lib/constants.ts`](lib/constants.ts) to set your real:

- Email address
- Phone number
- WhatsApp number
- Business address

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

## Deploy on Vercel

1. Push the project to GitHub
2. Import the repo at [vercel.com](https://vercel.com)
3. Add environment variables in the Vercel dashboard
4. Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

## Project Structure

```
app/
  page.tsx              # Home
  services/page.tsx     # Services
  about/page.tsx        # About
  contact/page.tsx      # Contact
  api/contact/route.ts  # Contact form API
components/             # Shared UI components
lib/
  constants.ts          # Site content and config
  validations.ts        # Form validation (Zod)
public/
  logo-light.png        # Header logo
  logo-dark.png         # Footer logo
```

## Scripts

```bash
npm run dev      # Start development server
npm run build    # Production build
npm run start    # Start production server
npm run lint     # Run ESLint
```
