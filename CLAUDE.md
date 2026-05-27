# QRcraft — Project Intelligence

## Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router, Turbopack) |
| Language | TypeScript 5 — `strict: true`, no `any` |
| Styling | Tailwind CSS v4 (CSS-first config) |
| Components | shadcn/ui `base-nova` style |
| Icons | lucide-react |
| Auth + DB | Supabase (`@supabase/ssr`) |
| QR Engine | qr-code-styling (Client Component only) |
| Fonts | Geist Sans + Geist Mono (via `next/font/google`) |

## Commands

```bash
pnpm dev          # dev server (Turbopack)
pnpm build        # production build
pnpm tsc --noEmit # type check
pnpm lint         # ESLint
pnpm dlx shadcn@latest add <name>   # add shadcn component
```

## MCP Servers

- **context7** — resolves any library to its up-to-date documentation.
  Usage in prompts: `use context7` or add `use context7` at the end.
  Useful for: Tailwind v4 API, Next.js App Router, shadcn/ui, Supabase, qr-code-styling.

- **supabase** — manage tables, run SQL, inspect schema for project `ffqkywfanbsotkxotejw`.
  Requires env var `SUPABASE_ACCESS_TOKEN` (Supabase management API token).

## Path Aliases

```
@/app/*          → src/app/*
@/components/*   → src/components/*
@/components/ui/ → src/components/ui/  (shadcn)
@/hooks/*        → src/hooks/*
@/lib/*          → src/lib/*
@/types/*        → src/types/*
```

---

## Skill: Tailwind CSS v4 — Global CSS Classes

### How v4 differs from v3

Tailwind v4 is **CSS-first**: there is no `tailwind.config.js`. All
configuration lives in `src/app/globals.css`.

```css
@import "tailwindcss";          /* replaces @tailwind base/components/utilities */
@import "tw-animate-css";
@import "shadcn/tailwind.css";  /* shadcn token bridge */
```

### Token system — `@theme inline`

The `@theme inline { }` block maps CSS custom properties to Tailwind
utility tokens so classes like `bg-background` resolve at build time.

```css
/* Pattern: --color-<token>: var(--<css-var>) */
@theme inline {
  --color-background:  var(--background);
  --color-primary:     var(--primary);
  --color-destructive: var(--destructive);
  --radius-lg:         var(--radius);
  --radius-xl:         calc(var(--radius) * 1.4);
}
```

**Rule:** Always use token utilities (`bg-background`, `text-foreground`,
`border-border`, `text-destructive`, `text-muted-foreground`).
Never hardcode hex/rgb/oklch values in className strings.

### Color format: OKLCH

All design tokens use OKLCH `oklch(L C H)`. Do not convert to hex.

```css
--primary: oklch(0.205 0 0);
--destructive: oklch(0.577 0.245 27.325);
```

### Custom variant

```css
@custom-variant dark (&:is(.dark *));
```

This is how `dark:` prefix works. The `.dark` class on `<html>` activates it.

### Adding custom utilities

Use `@utility` (v4) not `@layer utilities`.

```css
@utility container-page {
  @apply mx-auto w-full max-w-5xl px-4;
}

@utility text-balance {
  text-wrap: balance;
}
```

### Adding custom base styles

Use `@layer base` for element-level defaults only.

```css
@layer base {
  h1 { @apply text-3xl font-bold tracking-tight; }
  h2 { @apply text-2xl font-semibold tracking-tight; }
}
```

### Radius scale (already configured)

| Token | Value |
|---|---|
| `rounded-sm` | `calc(var(--radius) * 0.6)` |
| `rounded-md` | `calc(var(--radius) * 0.8)` |
| `rounded-lg` | `var(--radius)` → `0.625rem` |
| `rounded-xl` | `calc(var(--radius) * 1.4)` |
| `rounded-2xl` | `calc(var(--radius) * 1.8)` |

### Responsive breakpoints (v4 defaults)

`sm:640px` `md:768px` `lg:1024px` `xl:1280px` `2xl:1536px`

Mobile-first: write base styles for mobile, add `md:` / `lg:` for larger.

---

## Skill: shadcn/ui Components

### Installing

```bash
pnpm dlx shadcn@latest add <component-name>
# Examples:
pnpm dlx shadcn@latest add button card input label select separator skeleton
pnpm dlx shadcn@latest add dialog sheet tooltip badge
```

Files land in `src/components/ui/`. **Never edit generated files** — instead
create wrapper components in `src/components/`.

### Config (`components.json`)

```json
{
  "style": "base-nova",
  "tailwind": { "cssVariables": true, "baseColor": "neutral" },
  "aliases": { "ui": "@/components/ui", "utils": "@/lib/utils" }
}
```

### `cn()` utility

Always merge classes with `cn()` from `@/lib/utils` (wraps `clsx` + `tailwind-merge`).

```tsx
import { cn } from '@/lib/utils'

<div className={cn('base-classes', conditional && 'extra', className)} />
```

### Variant pattern with `cva`

```tsx
import { cva, type VariantProps } from 'class-variance-authority'

const cardVariants = cva('rounded-lg border bg-card p-4', {
  variants: {
    size: {
      sm: 'p-3 text-sm',
      md: 'p-4',
      lg: 'p-6',
    },
  },
  defaultVariants: { size: 'md' },
})

interface CardProps extends VariantProps<typeof cardVariants> {
  className?: string
  children: React.ReactNode
}
```

### Available components (installed)

`Button` `Card` `CardContent` `CardHeader` `CardTitle` `CardDescription`
`Input` `Label` `Select` `SelectTrigger` `SelectContent` `SelectItem`
`SelectValue` `Separator` `Skeleton` `Badge` `Sonner`

---

## Skill: TypeScript Interfaces

### Rules

- `interface` for object shapes that may be extended or implemented.
- `type` for everything else (unions, intersections, mapped, conditional).
- No `I` prefix. PascalCase. No `any` — use `unknown` + type guards.
- Shared interfaces live in `src/types/`. Component-local interfaces can
  be inline in the same file.

### Props interfaces

```tsx
// Inline — same file as component, not exported unless reused elsewhere
interface QRControlsProps {
  config: QRConfig
  onUpdate: (partial: Partial<QRConfig>) => void
  onReset: () => void
}

// Exported — shared across multiple components
export interface PageProps {
  params: Promise<{ id: string }>
  searchParams: Promise<Record<string, string | string[]>>
}
```

### Extension

```tsx
interface BaseButtonProps {
  disabled?: boolean
  className?: string
}

interface IconButtonProps extends BaseButtonProps {
  icon: React.ReactNode
  label: string
}
```

### Supabase row interfaces

```tsx
// Mirror the Supabase table exactly; use snake_case for column names
interface QRRecord {
  id: string
  user_id: string
  name: string
  config: QRConfig        // jsonb column
  created_at: string      // timestamptz as ISO string
  updated_at: string
}
```

### API response interfaces

```tsx
interface ApiResponse<T> {
  data: T | null
  error: string | null
}

interface PaginatedResponse<T> {
  data: T[]
  count: number
  page: number
  pageSize: number
}
```

---

## Skill: TypeScript Types

### Rules

- Use `type` for unions, literals, mapped types, conditional types.
- Export from `src/types/` when used across multiple files.
- Prefer `readonly` on arrays/tuples that should not be mutated.

### Literal union types

```ts
// Constrained string values — preferred over plain string
export type ErrorCorrectionLevel = 'L' | 'M' | 'Q' | 'H'
export type QRSize = 128 | 256 | 512
export type DotStyle =
  | 'square' | 'dots' | 'rounded'
  | 'extra-rounded' | 'classy' | 'classy-rounded'
export type Theme = 'light' | 'dark' | 'system'
```

### Utility types

```ts
// Partial config for update operations
type QRConfigUpdate = Partial<QRConfig>

// Pick specific fields
type QRPreview = Pick<QRRecord, 'id' | 'name' | 'config'>

// Omit generated fields before insert
type QRRecordInsert = Omit<QRRecord, 'id' | 'created_at' | 'updated_at'>

// Make all fields required for validated forms
type QRFormValues = Required<Pick<QRConfig, 'url' | 'size' | 'errorCorrectionLevel'>>
```

### Discriminated unions

```ts
type AsyncState<T> =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'error'; error: string }
```

### Type guards

```ts
function isValidUrl(value: string): boolean {
  try { new URL(value); return true } catch { return false }
}

function isQRRecord(value: unknown): value is QRRecord {
  return (
    typeof value === 'object' &&
    value !== null &&
    'id' in value &&
    'config' in value
  )
}
```

### `src/types/qr.ts` — current exports

`ErrorCorrectionLevel` `QRSize` `DotStyle` `CornerStyle`
`QRConfig` `QRRecord` `DEFAULT_QR_CONFIG`

---

## Skill: Light / Dark Mode

### Architecture

Themes are controlled by a `.dark` class on `<html>`. CSS variables in
`globals.css` define both palettes. `next-themes` manages the class toggle.

### CSS variables (already configured in `globals.css`)

```css
:root {
  /* light palette — OKLCH */
  --background: oklch(1 0 0);
  --foreground: oklch(0.145 0 0);
  --primary: oklch(0.205 0 0);
  --muted-foreground: oklch(0.556 0 0);
  /* ... full list in globals.css */
}

.dark {
  --background: oklch(0.145 0 0);
  --foreground: oklch(0.985 0 0);
  --primary: oklch(0.922 0 0);
  /* ... */
}
```

### Adding `next-themes` ThemeProvider

```bash
# Already installed as dependency
```

Update `src/app/layout.tsx`:

```tsx
import { ThemeProvider } from 'next-themes'

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
```

`suppressHydrationWarning` on `<html>` is required — next-themes adds the
class server-side and client-side which can cause React hydration warnings.

### Theme toggle component

```tsx
"use client"
import { useTheme } from 'next-themes'
import { Button } from '@/components/ui/button'
import { Moon, Sun } from 'lucide-react'

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme()
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
      aria-label="Toggle theme"
    >
      <Sun className="h-4 w-4 rotate-0 scale-100 transition-transform dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-transform dark:rotate-0 dark:scale-100" />
    </Button>
  )
}
```

### Conditional dark styles in Tailwind

```tsx
// Use dark: prefix — resolves via @custom-variant dark (&:is(.dark *))
<div className="bg-white dark:bg-zinc-900 text-black dark:text-white" />

// Prefer token utilities (they handle dark automatically via CSS vars)
<div className="bg-background text-foreground" />  // ← preferred
```

### Adding a new design token for both themes

1. Add the CSS variable to `:root` AND `.dark` in `globals.css`.
2. Map it in `@theme inline` so Tailwind generates the utility class.

```css
/* globals.css */
:root   { --brand: oklch(0.55 0.2 264); }
.dark   { --brand: oklch(0.75 0.15 264); }

@theme inline {
  --color-brand: var(--brand);
}
```

```tsx
// Now available as Tailwind utility
<div className="bg-brand text-brand" />
```

---

## Skill: QR Code Generation

### Core rule

`qr-code-styling` requires DOM access — it **must** live in a Client Component
with `"use client"`. Never import it in a Server Component or in a file without
`"use client"`.

### `buildQROptions` helper (`src/lib/qr/generateQR.ts`)

Maps `QRConfig` to the `qr-code-styling` options object. Always use this
function — don't construct the options object inline.

### Hydration pattern

```tsx
// useSyncExternalStore is the correct way to detect client mount.
// Do NOT use useEffect + setState to set a "mounted" flag — that
// triggers the react-hooks/set-state-in-effect lint error.
const emptySubscribe = () => () => {}
const isClient = useSyncExternalStore(emptySubscribe, () => true, () => false)
```

### Init effect dependency

The init effect must depend on `[isClient]`, not `[]`. With SSR, the
container div is absent during hydration (isClient=false), so the effect
finds `containerRef.current === null` and returns early. The dep on
`isClient` ensures it re-runs once the container is in the DOM.

```tsx
useEffect(() => {
  if (!isClient || !containerRef.current) return
  // ...async init...
}, [isClient]) // intentional — not []
```

### Updating vs re-initialising

After init, use `qrRef.current.update(options)` — do not re-create the
instance on every config change.

```tsx
useEffect(() => {
  if (!qrRef.current || loading) return
  qrRef.current.update(buildQROptions(config))
}, [config, loading])
```

---

## Skill: Supabase Patterns

### Client selection

| Context | Import |
|---|---|
| Server Component / Route Handler / Server Action | `import { createClient } from '@/lib/supabase/server'` |
| Client Component | `import { createClient } from '@/lib/supabase/client'` |

### Auth — Google OAuth

```ts
// Trigger login (client)
const supabase = createClient()
await supabase.auth.signInWithOAuth({
  provider: 'google',
  options: { redirectTo: `${origin}/auth/callback` },
})

// Callback handled by src/app/auth/callback/route.ts
// Exchanges the code for a session and redirects to /dashboard
```

### Reading the session (Server Component)

```ts
const supabase = await createClient()
const { data: { user } } = await supabase.auth.getUser()
if (!user) redirect('/login')
```

### Database query pattern

```ts
// Always destructure { data, error } — never assume success
const { data, error } = await supabase
  .from('qr_codes')
  .select('*')
  .eq('user_id', user.id)
  .order('created_at', { ascending: false })

if (error) throw new Error(error.message)
```

### RLS

All tables must have Row Level Security enabled. Users can only access
their own rows. Policy pattern: `auth.uid() = user_id`.

### Environment variables

```
NEXT_PUBLIC_SUPABASE_URL      — project URL (safe to expose)
NEXT_PUBLIC_SUPABASE_ANON_KEY — publishable/anon key (safe to expose)
```

Never use the service role key in client-side code.

---

## Skill: Component File Structure

### Directory layout

```
src/
├── app/
│   ├── layout.tsx            — root layout (ThemeProvider, fonts)
│   ├── page.tsx              — home (/)
│   ├── globals.css           — Tailwind v4 config + CSS vars
│   ├── auth/callback/        — OAuth callback route
│   └── dashboard/            — protected routes
├── components/
│   ├── ui/                   — shadcn generated (do not edit)
│   └── qr/                   — QR feature components
│       ├── QRGenerator.tsx   — layout shell (uses hook)
│       ├── QRControls.tsx    — config panel
│       └── QRPreview.tsx     — canvas preview
├── hooks/
│   └── useQRGenerator.ts     — QR config state
├── lib/
│   ├── utils.ts              — cn()
│   ├── qr/generateQR.ts      — buildQROptions()
│   └── supabase/
│       ├── client.ts         — browser client
│       └── server.ts         — server client (cookies)
└── types/
    └── qr.ts                 — QRConfig, QRRecord, enums
```

### Naming conventions

| Thing | Convention | Example |
|---|---|---|
| Component file | PascalCase | `QRControls.tsx` |
| Hook file | camelCase, `use` prefix | `useQRGenerator.ts` |
| Utility file | camelCase | `generateQR.ts` |
| Type file | camelCase | `qr.ts` |
| Route segment | kebab-case | `app/auth/callback/` |

### Client vs Server Component

Default to **Server Components**. Add `"use client"` only when the
component needs: browser APIs, event handlers, `useState`, `useEffect`,
or libraries that require DOM (qr-code-styling).

---

## Skill: Form Handling & Validation

### URL validation (no library needed)

```ts
function isValidUrl(url: string): boolean {
  if (!url.trim()) return false
  try { new URL(url); return true } catch { return false }
}
```

### Inline error display pattern

```tsx
{value && !isValid(value) && (
  <p className="text-xs text-destructive">
    Please enter a valid URL (include https://)
  </p>
)}
```

### Controlled inputs

Always use controlled inputs in QR forms — the config state is the
single source of truth.

```tsx
<Input
  value={config.url}
  onChange={e => onUpdate({ url: e.target.value })}
/>
```

### Zod (when needed for server actions or API boundaries)

```ts
import { z } from 'zod'

const QRConfigSchema = z.object({
  url: z.string().url('Must be a valid URL'),
  size: z.union([z.literal(128), z.literal(256), z.literal(512)]),
  errorCorrectionLevel: z.enum(['L', 'M', 'Q', 'H']),
})
```

---

## Skill: Error Handling

### Route handlers

```ts
export async function GET(request: Request) {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase.from('...').select()
    if (error) return Response.json({ error: error.message }, { status: 500 })
    return Response.json({ data })
  } catch (err) {
    return Response.json({ error: 'Unexpected error' }, { status: 500 })
  }
}
```

### Server Components — not-found and error boundaries

```tsx
// app/dashboard/page.tsx
import { notFound } from 'next/navigation'

const { data: record } = await supabase.from('qr_codes').select().eq('id', id).single()
if (!record) notFound()
```

```
app/error.tsx     — catches errors in the subtree (must be "use client")
app/not-found.tsx — 404 page
```

### Client Components — toast feedback

```tsx
import { toast } from 'sonner'

async function handleSave() {
  try {
    await saveQR(config)
    toast.success('QR code saved')
  } catch {
    toast.error('Failed to save — please try again')
  }
}
```

---

## Skill: App Router Conventions

### Route types

```
app/page.tsx                  — static or dynamic page
app/loading.tsx               — Suspense boundary (auto)
app/error.tsx                 — error boundary ("use client")
app/not-found.tsx             — 404
app/layout.tsx                — shared layout (no re-render on nav)
app/<segment>/route.ts        — API route handler (GET, POST, etc.)
```

### Dynamic routes

```
app/qr/[id]/page.tsx          — /qr/<id>
app/qr/[id]/edit/page.tsx     — /qr/<id>/edit
```

### Middleware (`src/middleware.ts`)

Used for auth session refresh — runs on every matched request.

```ts
import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  // Refresh session so it doesn't expire mid-browsing
  const response = NextResponse.next()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { /* ... */ } }
  )
  await supabase.auth.getUser()
  return response
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
```

---

## Skill: Performance & Code Splitting

### Lazy-load heavy Client Components

```tsx
import dynamic from 'next/dynamic'

const QRPreview = dynamic(
  () => import('@/components/qr/QRPreview').then(m => m.QRPreview),
  { ssr: false, loading: () => <Skeleton className="h-64 w-64 rounded-xl" /> }
)
```

`ssr: false` is required for components that use `qr-code-styling` or
any library that accesses `window` / `document` at import time.

### Dynamic import inside effect (current QRPreview approach)

For `qr-code-styling`, the instance is created inside a `useEffect` via
`await import('qr-code-styling')`. This avoids bundling the library in
the initial chunk — it's loaded only when the component mounts on the client.

### Image optimisation

Always use `next/image` instead of `<img>`.

```tsx
import Image from 'next/image'
<Image src="/logo.png" alt="QRcraft" width={120} height={40} priority />
```

### Font loading (already configured)

Geist Sans and Geist Mono are loaded via `next/font/google` with CSS
variable injection — no layout shift, no external requests at runtime.
