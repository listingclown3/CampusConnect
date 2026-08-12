# SpartanCircle (CampusConnect)

A mobile-first web app that helps SJSU freshmen and transfer students find compatible friends, study buddies, project partners, study "pods," and campus events — through a deterministic compatibility-matching algorithm (no ML/black-box scoring).

The app is designed to run fully as a **demo with zero backend setup** (mock data + localStorage) and to transparently switch to a real **Supabase** backend once one is configured.

## Tech Stack

- **Framework:** Next.js 16 (App Router) · React 19 · TypeScript
- **Styling/UI:** Tailwind CSS v4 · shadcn/ui (`base-nova` style) · Base UI (`@base-ui/react`) · lucide-react icons · next-themes · sonner (toasts)
- **State:** Zustand
- **Backend:** Supabase — Postgres, Auth, Row-Level Security, Realtime
- **Matching engine:** hand-written deterministic scoring utilities (no external ML)
- **AI text generation:** OpenAI API (optional — see note below), template-based fallback otherwise
- **PWA:** Web app manifest + service worker, offline page
- **Testing:** Vitest + Testing Library + jsdom
- **Package manager:** pnpm

## How it fits together

- **App routes** live in `src/app/`, split into `(auth)` (login/signup) and `(main)` (dashboard, matches, pods, events, clubs, chat, settings) route groups.
- **Data layer** (`src/lib/data/`, `src/lib/mock-data/`) is dual-mode: it calls Supabase when `NEXT_PUBLIC_SUPABASE_URL`/`NEXT_PUBLIC_SUPABASE_ANON_KEY` are set, and otherwise transparently falls back to seeded mock data persisted in `localStorage` — so the whole app (auth, chat, matches, pods) is demoable with no backend at all.
- **Matching logic** (`src/lib/matching/`) computes 1:1 match scores, pod groupings, and event recommendations as pure, unit-tested functions (`tests/matching/`).
- **AI-generated copy** (`src/lib/ai/index.ts`) — match explanations, conversation starters, pod/event blurbs — is wired for OpenAI but currently always uses the template fallback: `isOpenAIConfigured()` reads a server-only env var from client components, so it evaluates `false` in the browser bundle. Wiring it up for real would mean calling it from a server route (e.g. `/api/ai/generate`) instead.
- **Auth** (`src/lib/auth/`) restricts sign-in to `@sjsu.edu` addresses via Supabase Auth, with a mock-auth path for the no-backend demo mode.
- **Realtime chat** (`src/lib/chat/`) uses Supabase Realtime channels when configured, with a localStorage-based fallback otherwise.
- **Database schema & RLS policies** are defined as sequential SQL migrations in `supabase/migrations/001`–`008`, applied via `pnpm db:migrate` (`scripts/migrate.mjs`, which is also wired into `predev`/`prebuild` and no-ops safely if Supabase isn't configured or the build is running on Vercel).
- **`src/proxy.ts`** is this project's Next.js middleware — the framework version in use renamed the `middleware.ts` convention to `proxy.ts`. It refreshes the Supabase session cookie on every request.
- **`SpartanCircle/`** at the repo root is an earlier standalone React + Vite prototype, kept only as design/reference material — it is not part of the running app.

## Getting Started

1. Install dependencies:
   ```bash
   pnpm install
   ```
2. Copy the environment template and fill in your own values:
   ```bash
   cp .env.example .env.local
   ```
   - Supabase keys are optional for local demo use — without them the app runs entirely on mock data.
   - `OPENAI_API_KEY` is optional; template-based fallback text is used when it's unset.
3. (Optional, if using a real Supabase project) push the schema:
   ```bash
   pnpm db:migrate
   ```
4. Start the dev server:
   ```bash
   pnpm dev
   ```
   Open [http://localhost:3000](http://localhost:3000).

## Other commands

```bash
pnpm build        # production build
pnpm start         # run a production build
pnpm test          # run unit tests (Vitest)
pnpm test:watch    # watch mode
pnpm lint          # ESLint
```

## Project structure

```
src/app/            Next.js App Router pages & layouts
src/components/      Shared React components (ui/ = shadcn primitives)
src/lib/matching/    Deterministic match/pod/event scoring
src/lib/data/        Supabase + mock/localStorage data layer
src/lib/supabase/    Supabase client setup (browser + server)
src/lib/ai/          AI copy generation with template fallbacks
src/lib/auth/        Auth (Supabase + mock)
src/lib/chat/        Realtime chat + localStorage fallback
src/types/           Shared TypeScript types
supabase/migrations/ SQL schema & RLS policies
tests/matching/      Unit tests for the matching engine
public/              Static assets, PWA manifest & icons
SpartanCircle/        Reference-only earlier prototype (not the live app)
```
