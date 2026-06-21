# CSC / JSK / Cyber Cafe Field Survey

A multi-language (Hindi + English) survey data collection website for field researchers conducting in-person interviews with CSC, Jan Seva Kendra, and Cyber Cafe operators across India.

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Hosting**: Vercel
- **Database**: Supabase (PostgreSQL)
- **Styling**: Tailwind CSS v4
- **i18n**: next-intl (Hindi default, English secondary)

## Features

- 📋 16-question survey across 6 sections
- 🌐 Bilingual interface (Hindi primary, English secondary)
- 📱 Mobile-first design with large touch targets
- 💾 Auto-save to localStorage while typing
- 📶 Offline-ready with automatic retry on reconnect
- 🔒 Password-protected results dashboard
- 📊 Summary statistics on the results page

## Setup

### 1. Clone & Install

```bash
git clone <your-repo-url>
cd csc-survey
npm install
```

### 2. Environment Variables

Copy the example file and fill in your Supabase credentials:

```bash
cp .env.local.example .env.local
```

Edit `.env.local` with your values:

| Variable | Where to Get It |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase → Project Settings → API → Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase → Project Settings → API → anon public key |
| `RESULTS_PASSWORD` | Choose any password for the Results page |
| `SUPABASE_SERVICE_ROLE_KEY` | *(Optional)* Supabase → Project Settings → API → service_role key |

> ⚠️ **Never commit `.env.local` to git.** It is already in `.gitignore`.

### 3. Run Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — the app defaults to Hindi.

### 4. Deploy to Vercel

1. Push your code to a GitHub repository
2. Import the repository into [Vercel](https://vercel.com)
3. In **Vercel → Project Settings → Environment Variables**, add:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `RESULTS_PASSWORD`
   - `SUPABASE_SERVICE_ROLE_KEY` *(optional, for results page reads)*
4. Deploy — Vercel auto-detects Next.js
5. Test the live `.vercel.app` link end-to-end

## Pages

| Route | Description |
|---|---|
| `/` | Home / Landing page with survey introduction |
| `/survey` | Multi-section survey form with auto-save |
| `/thank-you` | Confirmation page after submission |
| `/results` | Password-protected results dashboard |

## Database

The app connects to an existing `public.survey_responses` table in Supabase. The table schema is defined in the project PRD and must already exist before using the app.

### Row Level Security (RLS)

- **Insert**: Allowed for `anon` role (anyone can submit surveys)
- **Select**: Allowed for `authenticated` role only (the API route uses the service role key to bypass this)

## License

Private — For internal use only.
