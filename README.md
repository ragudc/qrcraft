# QRCraft — Free QR Code Generator

A full-stack web application for generating beautiful, fully customizable QR codes. Built with Next.js 16, Supabase, and shadcn/ui. No sign-up required to generate and download — sign in with Google to save your QR code history.

**Live:** [https://qrcraft-mocha.vercel.app](https://qrcraft-mocha.vercel.app)

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Architecture Overview](#architecture-overview)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Supabase Setup](#supabase-setup)
- [Available Scripts](#available-scripts)
- [QR Generation System](#qr-generation-system)
- [Export System](#export-system)
- [Authentication Flow](#authentication-flow)
- [API Routes](#api-routes)
- [Component Architecture](#component-architecture)
- [Type System](#type-system)
- [Styling System](#styling-system)
- [Deployment](#deployment)

---

## Features

### Generator (no account required)
- Real-time QR preview — updates on every keystroke
- URL validation with inline error feedback
- 3 size options: 128 × 128, 256 × 256, 512 × 512 px
- 4 error correction levels: L (7%), M (15%), Q (25%), H (30%)
- 6 dot styles: Square, Dots, Rounded, Extra-rounded, Classy, Classy-rounded
- 3 corner styles: Square, Extra-rounded, Dot
- Foreground and background color pickers
- Logo overlay: upload any image, set size (5–40% of QR), auto-adjusts error correction
- Export as PNG, SVG, or PDF (with metadata)

### Dashboard (requires Google login)
- Save unlimited QR codes to your account
- Preview thumbnail stored in Supabase Storage
- Load any saved config back into the generator
- Delete QR codes with confirmation dialog
- Row-Level Security: each user sees only their own records

### UI / UX
- Light and dark mode (system default, togglable)
- Smooth entry animations respecting `prefers-reduced-motion`
- Fully responsive: 375 px → 1440 px
- Sticky header with backdrop blur
- Toast notifications for save / delete feedback

---

## Tech Stack

| Layer | Technology | Version |
|---|---|---|
| Framework | Next.js (App Router, Turbopack) | 16.2.6 |
| Language | TypeScript (`strict: true`) | 5 |
| Styling | Tailwind CSS v4 (CSS-first config) | 4 |
| Components | shadcn/ui (`base-nova` style) | 4 |
| Icons | lucide-react | 1.16 |
| Auth + DB | Supabase (`@supabase/ssr`) | 2.106 |
| QR Engine | qr-code-styling | 1.9.2 |
| PDF Export | jsPDF + html2canvas | 4.2 / 1.4 |
| Theme | next-themes | 0.4.6 |
| Toasts | Sonner | 2.0.7 |
| Animations | tw-animate-css | 1.4.0 |
| Fonts | Geist Sans + Geist Mono (next/font) | — |
| Deployment | Vercel | — |

---

## Project Structure

```
QRcraft/
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── layout.tsx                # Root layout: ThemeProvider, Header, Footer
│   │   ├── page.tsx                  # Home: Hero → Features → HowItWorks → Generator
│   │   ├── globals.css               # Tailwind v4 config + CSS tokens + animations
│   │   ├── favicon.svg               # Custom QR-pattern favicon
│   │   ├── auth/
│   │   │   └── callback/route.ts     # OAuth code → session exchange
│   │   ├── api/
│   │   │   └── qr/save/route.ts      # POST — save QR + upload preview to Storage
│   │   └── dashboard/
│   │       └── page.tsx              # Protected: list + manage saved QR codes
│   │
│   ├── components/
│   │   ├── landing/
│   │   │   ├── HeroSection.tsx       # Headline, badge, CTAs, stats row
│   │   │   ├── FeaturesSection.tsx   # 6-card feature grid
│   │   │   └── HowItWorksSection.tsx # 3-step visual walkthrough
│   │   ├── qr/
│   │   │   ├── QRGenerator.tsx       # Layout shell — wires hook → controls + preview
│   │   │   ├── QRControls.tsx        # All config inputs (URL, size, ECL, styles)
│   │   │   ├── QRPreview.tsx         # Canvas render via qr-code-styling (Client)
│   │   │   ├── QRDownloadButtons.tsx # PNG / SVG / PDF download triggers
│   │   │   ├── QRSaveButton.tsx      # Capture preview → POST /api/qr/save
│   │   │   ├── QRColorPicker.tsx     # Controlled color input wrapper
│   │   │   ├── QRStyleSelector.tsx   # Dot style + corner style selects
│   │   │   └── QRLogoUpload.tsx      # File input → base64 logoUrl
│   │   ├── dashboard/
│   │   │   ├── QRGrid.tsx            # Responsive grid of QRCard components
│   │   │   └── QRCard.tsx            # Preview image, URL, load + delete actions
│   │   ├── shared/
│   │   │   ├── Header.tsx            # Sticky nav: logo, UserMenu, ThemeToggle
│   │   │   ├── Footer.tsx            # Brand, links, copyright
│   │   │   ├── ThemeProvider.tsx     # next-themes wrapper
│   │   │   ├── ThemeToggle.tsx       # Sun/Moon icon toggle button
│   │   │   └── UserMenu.tsx          # Avatar dropdown: dashboard + sign out
│   │   └── ui/                       # shadcn/ui generated — do not edit directly
│   │
│   ├── hooks/
│   │   ├── useQRGenerator.ts         # QRConfig state: updateConfig, resetConfig
│   │   └── useAuth.ts                # Supabase user session (client-side)
│   │
│   ├── lib/
│   │   ├── utils.ts                  # cn() — clsx + tailwind-merge
│   │   ├── qr/
│   │   │   ├── generateQR.ts         # buildQROptions(config) → qr-code-styling opts
│   │   │   └── exportHelpers.ts      # exportPNG / exportSVG / exportPDF / captureQRAsBase64
│   │   └── supabase/
│   │       ├── client.ts             # Browser Supabase client (Client Components)
│   │       ├── server.ts             # Server Supabase client (Server Components / Actions)
│   │       ├── auth-actions.ts       # signInWithGoogle / signOut server actions
│   │       └── qr-actions.ts        # deleteQRCode server action
│   │
│   └── types/
│       └── qr.ts                     # QRConfig, QRRecord, all literal union types
│
├── public/                           # Static assets
├── .env.local                        # Local environment variables (not committed)
├── components.json                   # shadcn/ui config
├── package.json
└── tsconfig.json
```

---

## Architecture Overview

```
Browser
  │
  ├─ Next.js App Router (Server Components by default)
  │    ├─ page.tsx — SSR, awaits searchParams, passes loadId to QRGenerator
  │    ├─ dashboard/page.tsx — protected SSR page, queries Supabase server-side
  │    └─ layout.tsx — root shell (ThemeProvider, Header, Footer)
  │
  ├─ Client Components ("use client")
  │    ├─ QRGenerator — owns useQRGenerator hook, wires controls ↔ preview
  │    ├─ QRPreview — dynamically imports qr-code-styling, renders canvas
  │    ├─ QRControls — controlled inputs → updateConfig
  │    ├─ QRDownloadButtons — calls exportHelpers on click
  │    └─ HeroSection — scroll-into-view CTA
  │
  ├─ Route Handlers (Edge-compatible)
  │    └─ /api/qr/save — authenticates user, uploads preview, inserts DB row
  │
  └─ Supabase
       ├─ Auth — Google OAuth (PKCE flow via @supabase/ssr)
       ├─ Database — qr_codes table with RLS
       └─ Storage — qr-previews bucket (per-user folders)
```

---

## Getting Started

### Prerequisites

- Node.js 20+
- pnpm 9+ (`npm install -g pnpm`)
- A [Supabase](https://supabase.com) project (free tier works)
- A Google OAuth app configured in Supabase Auth settings

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/qrcraft.git
cd qrcraft

# Install dependencies
pnpm install

# Copy the environment template and fill in your values
cp .env.local.example .env.local
```

### Running locally

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000). The app starts with Turbopack for fast HMR.

---

## Environment Variables

Create a `.env.local` file in the project root with the following variables:

```env
# Supabase — both values are safe to expose (they are the anon/public keys)
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Site URL — used by Supabase to construct OAuth redirect URIs
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

> In production (Vercel), set `NEXT_PUBLIC_SITE_URL` to your deployed domain, e.g. `https://qrcraft-mocha.vercel.app`.

**Never commit `.env.local`.** It is already listed in `.gitignore`.

---

## Supabase Setup

### 1. Create the `qr_codes` table

Run the following SQL in your Supabase SQL editor:

```sql
create table public.qr_codes (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  url         text not null,
  config_json jsonb not null,
  preview_url text,
  label       text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- Enable Row Level Security
alter table public.qr_codes enable row level security;

-- Users can only see their own rows
create policy "Users can view own QR codes"
  on public.qr_codes for select
  using (auth.uid() = user_id);

-- Users can only insert their own rows
create policy "Users can insert own QR codes"
  on public.qr_codes for insert
  with check (auth.uid() = user_id);

-- Users can only delete their own rows
create policy "Users can delete own QR codes"
  on public.qr_codes for delete
  using (auth.uid() = user_id);
```

### 2. Create the `qr-previews` storage bucket

```sql
-- Create bucket (public so preview images load without auth)
insert into storage.buckets (id, name, public)
values ('qr-previews', 'qr-previews', true);

-- Allow authenticated users to upload to their own folder
create policy "Authenticated users can upload previews"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'qr-previews' and auth.uid()::text = (storage.foldername(name))[1]);

-- Allow authenticated users to delete their own previews
create policy "Users can delete own previews"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'qr-previews' and auth.uid()::text = (storage.foldername(name))[1]);

-- Allow anyone to read previews (public bucket)
create policy "Anyone can view previews"
  on storage.objects for select
  using (bucket_id = 'qr-previews');
```

### 3. Configure Google OAuth

1. Go to **Supabase Dashboard → Authentication → Providers → Google**
2. Enable Google and enter your Google OAuth **Client ID** and **Client Secret**
3. Add these **Authorized redirect URIs** in your Google Cloud Console:
   - `https://your-project-id.supabase.co/auth/v1/callback`
4. Add these **Redirect URLs** in Supabase:
   - `http://localhost:3000/auth/callback` (development)
   - `https://qrcraft-mocha.vercel.app/auth/callback` (production)

---

## Available Scripts

```bash
pnpm dev          # Start dev server with Turbopack at localhost:3000
pnpm build        # Production build — fails on type errors or lint errors
pnpm start        # Serve the production build locally
pnpm lint         # Run ESLint across all source files
npx tsc --noEmit  # Type-check without emitting files
```

To add a new shadcn/ui component:

```bash
pnpm dlx shadcn@latest add <component-name>
# Example:
pnpm dlx shadcn@latest add tooltip popover
```

Generated files land in `src/components/ui/`. Never edit them directly — create wrapper components in `src/components/` instead.

---

## QR Generation System

### How it works

1. `useQRGenerator` hook holds the `QRConfig` state and exposes `updateConfig` / `resetConfig`.
2. Every config change propagates to `QRPreview` via props.
3. `QRPreview` dynamically imports `qr-code-styling` inside a `useEffect` (avoids SSR issues and keeps the library out of the initial bundle).
4. `buildQROptions(config)` in `src/lib/qr/generateQR.ts` maps `QRConfig` to the `qr-code-styling` options object.
5. After initial render, subsequent updates call `qrRef.current.update(options)` — the instance is never recreated, only updated.

### Client-only rule

`qr-code-styling` accesses the DOM at import time. It **must** live in a `"use client"` component. The hydration guard uses `useSyncExternalStore` (not `useEffect + useState`) to detect the client mount:

```tsx
const isClient = useSyncExternalStore(emptySubscribe, () => true, () => false)
```

### QRConfig shape

| Field | Type | Default | Description |
|---|---|---|---|
| `url` | `string` | `''` | The URL encoded in the QR code |
| `size` | `128 \| 256 \| 512` | `256` | Output pixel size |
| `errorCorrectionLevel` | `'L' \| 'M' \| 'Q' \| 'H'` | `'M'` | Data redundancy level |
| `foregroundColor` | `string` | `'#000000'` | Dot color (hex) |
| `backgroundColor` | `string` | `'#ffffff'` | Background color (hex) |
| `dotStyle` | `DotStyle` | `'square'` | Shape of QR data modules |
| `cornerStyle` | `CornerStyle` | `'square'` | Shape of the 3 finder patterns |
| `logoEnabled` | `boolean` | `false` | Whether to show the logo overlay |
| `logoUrl` | `string \| null` | `null` | Base64 data URL of the uploaded logo |
| `logoSize` | `number` | `20` | Logo size as % of QR size (5–40) |

---

## Export System

All export logic lives in `src/lib/qr/exportHelpers.ts`. Downloads are triggered by creating a temporary `<a>` element and clicking it programmatically.

### File naming

Every downloaded file gets a slug derived from the encoded URL plus a timestamp:

```
qrcraft-github-com-your-profile-1716820000000.png
```

### PNG export

Calls `qrInstance.getRawData('png')` from `qr-code-styling`, which returns a `Blob`. No canvas manipulation needed.

### SVG export

Calls `qrInstance.getRawData('svg')`, which returns a `Blob` of raw SVG markup. Fully scalable, ideal for print.

### PDF export

Uses `html2canvas` to rasterize the live preview container at `2×` resolution, then `jsPDF` to compose an A4 document with:
- Centered title ("QRCraft")
- The QR image scaled to a max of 120 mm
- Metadata block: URL, generation date, pixel size
- Footer watermark

The two libraries (`jspdf`, `html2canvas`) are lazily imported inside the function so they only load when the user clicks "Download PDF".

---

## Authentication Flow

QRCraft uses **Google OAuth with the PKCE flow** via `@supabase/ssr`:

```
User clicks "Sign in"
  → signInWithGoogle() server action
  → supabase.auth.signInWithOAuth({ provider: 'google', redirectTo: /auth/callback })
  → Browser redirects to Google consent screen
  → Google redirects to /auth/callback?code=...
  → exchangeCodeForSession(code) sets the session cookie
  → NextResponse.redirect('/dashboard')
```

Session cookies are managed by `@supabase/ssr` using `cookies()` from `next/headers`. The middleware in `src/middleware.ts` refreshes the session on every request so it never expires mid-session.

### Client vs server Supabase clients

| Where | Import |
|---|---|
| Server Components, Route Handlers, Server Actions | `import { createClient } from '@/lib/supabase/server'` |
| Client Components | `import { createClient } from '@/lib/supabase/client'` |

Using the wrong client in the wrong context will cause runtime errors — the server client reads cookies via Next.js `cookies()`, which is unavailable in browser code.

---

## API Routes

### `POST /api/qr/save`

Saves a QR code configuration and its preview image to the authenticated user's account.

**Authentication:** Required (reads session from cookies)

**Request body:**

```json
{
  "config": { /* QRConfig object */ },
  "previewB64": "data:image/png;base64,iVBORw...",
  "label": "Optional display name"
}
```

**Flow:**
1. Verify user session — return 401 if unauthenticated
2. Validate that `config.url` is present
3. Strip the base64 header and upload the PNG buffer to `qr-previews/{user_id}/{timestamp}.png` in Supabase Storage
4. Insert a row into `qr_codes` with the config, preview URL, and label
5. Return `{ success: true, data: QRRecord }` with status 201

**Error responses:**

| Status | Cause |
|---|---|
| 400 | Missing or empty URL in config |
| 401 | Not authenticated |
| 500 | Supabase insert error or unexpected exception |

---

### `GET /auth/callback`

OAuth callback handler. Exchanges the authorization `code` for a Supabase session.

- On success: redirects to `/dashboard` (or the `next` query param)
- On failure: redirects to `/?error=auth_failed`

---

## Component Architecture

### Data flow in the generator

```
useQRGenerator (hook)
  └─ config: QRConfig
  └─ updateConfig(partial)
  └─ resetConfig()
  └─ hasValidUrl: boolean
        │
        ▼
  QRGenerator (Client Component — layout shell)
    ├─ QRControls ──────────────────► updateConfig
    │    ├─ URL input
    │    ├─ Size / ECL selects
    │    ├─ QRColorPicker (fg + bg)
    │    ├─ QRStyleSelector (dots + corners)
    │    └─ QRLogoUpload
    │
    └─ QRPreview (ref: QRPreviewHandle)
         ├─ Renders qr-code-styling canvas
         ├─ Exposes qrInstance + containerRef via forwardRef
         │
         ├─ QRDownloadButtons
         │    └─ Uses qrInstance + containerRef from ref
         │
         └─ QRSaveButton
              └─ Captures containerRef → base64 → POST /api/qr/save
```

### Dashboard data flow

```
DashboardPage (Server Component)
  └─ createClient() [server]
  └─ supabase.auth.getUser() → redirect if not logged in
  └─ supabase.from('qr_codes').select() → QRRecord[]
        │
        ▼
  QRGrid (Client Component)
    └─ QRCard × N
         ├─ Shows preview_url thumbnail
         ├─ "Load" → router.push('/?load={id}')
         └─ "Delete" → deleteQRCode(id) server action → revalidatePath
```

---

## Type System

All shared types live in `src/types/qr.ts`.

### Literal union types

```ts
type ErrorCorrectionLevel = 'L' | 'M' | 'Q' | 'H'
type QRSize               = 128 | 256 | 512
type DotStyle             = 'square' | 'dots' | 'rounded'
                          | 'extra-rounded' | 'classy' | 'classy-rounded'
type CornerStyle          = 'square' | 'extra-rounded' | 'dot'
```

These constrain all dropdowns and selects at the type level — passing an arbitrary string to a `DotStyle` field is a compile-time error.

### `QRRecord` — mirrors the Supabase table

```ts
interface QRRecord {
  id:          string      // uuid
  user_id:     string      // uuid → auth.users
  url:         string
  config_json: QRConfig    // jsonb column
  preview_url: string | null
  label:       string | null
  created_at:  string      // ISO 8601
  updated_at:  string      // ISO 8601
}
```

### Rules

- `interface` for object shapes; `type` for unions and utility types
- No `I` prefix, no `any` — use `unknown` + type guards at boundaries
- Component-local props interfaces are inline; shared types live in `src/types/`

---

## Styling System

QRCraft uses **Tailwind CSS v4** which is configured entirely in CSS — there is no `tailwind.config.js`.

### CSS-first config (`globals.css`)

```css
@import "tailwindcss";
@import "tw-animate-css";
@import "shadcn/tailwind.css";
```

### Token system

All colors are OKLCH and mapped in `@theme inline` so Tailwind utility classes resolve at build time:

```css
@theme inline {
  --color-background:  var(--background);
  --color-primary:     var(--primary);
  --color-destructive: var(--destructive);
  /* ... */
}
```

**Rule:** Always use token utilities (`bg-background`, `text-foreground`, `text-primary`, `text-muted-foreground`). Never hardcode hex or `oklch()` values in `className` strings.

### Dark mode

Activated by the `.dark` class on `<html>`, managed by `next-themes`. The `@custom-variant dark (&:is(.dark *))` directive is what makes `dark:` prefixes work.

### Entry animations

Two custom animation classes are defined in `globals.css`:

| Class | Effect |
|---|---|
| `animate-fade-in` | `opacity: 0 → 1` over 0.5 s |
| `animate-fade-in-up` | `opacity + translateY(16px) → 0` over 0.6 s |

Both are disabled when `@media (prefers-reduced-motion: reduce)` is active.

---

## Deployment

The project is deployed on **Vercel** with zero-config Next.js support.

### Steps to deploy

```bash
# Option A — Push to main (if CI/CD is configured)
git push origin main

# Option B — Manual deploy with Vercel CLI
npx vercel --prod
```

### Required environment variables in Vercel

Set these in **Vercel Dashboard → Project → Settings → Environment Variables**:

| Variable | Value |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anon key |
| `NEXT_PUBLIC_SITE_URL` | `https://qrcraft-mocha.vercel.app` |

### Build output

The production build generates a mix of static and server-rendered routes:

| Route | Type |
|---|---|
| `/` | Dynamic SSR (reads `searchParams`) |
| `/dashboard` | Dynamic SSR (reads auth session) |
| `/auth/callback` | Route Handler |
| `/api/qr/save` | Route Handler |

---

## License

MIT © 2025 QRCraft
