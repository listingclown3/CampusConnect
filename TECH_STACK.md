# Tech Stack — What We Used and Why

Reference doc for explaining our stack choices (e.g. for hackathon judging). See `README.md` for setup instructions and a quick architecture overview.

## Next.js 16 (App Router) + React 19 + TypeScript

One framework covers routing, server components, and API routes, so a small team ships a full-stack app without wiring a separate backend service. TypeScript matters more than usual here because the matching algorithm and data layer share types (`src/types/database.ts`) across dozens of files (`Profile`, `MatchBreakdown`, etc.) — a scoring bug from a typo'd field is exactly the kind of thing you don't want to discover during a demo.

## Supabase (Postgres + Auth + Realtime + RLS)

One provider gives you a real relational database, auth, and realtime pub/sub together — no separate services to provision or bill for under time pressure. Row-Level Security (`supabase/migrations/002`, `004`, `007`, `008`) lets access control live in the database itself rather than being re-implemented in every API call, which matters once you have direct messaging and pod membership where getting access checks wrong leaks private data.

## Dual-mode data layer (Supabase or localStorage mock)

The standout deliberate choice, explicit in the code: `isSupabaseConfigured()` gates every data call, and the app was originally built in an environment with no live Supabase instance available. Building the fallback in from day one means the whole app — auth, matches, pods, chat — is demoable on a laptop with zero setup and zero risk of a live DB outage killing a judged demo, while still being able to flip to production data by setting two env vars.

## Deterministic matching algorithm (no ML)

Pure, hand-written scoring functions (`src/lib/matching/score.ts` etc.) are unit-testable, explainable, and instant — no training data, no model hosting, no "why did it match us" black box. For a hackathon judged partly on whether the core feature works and can be explained on the spot, a scoring function you can point to line-by-line beats an ML model you'd have to hand-wave about.

## Tailwind CSS v4 + shadcn/ui + Base UI

shadcn/ui ships accessible, unstyled component source directly into the repo (not an opaque npm dependency), so components can be modified freely without fighting a library's API — fast for hackathon iteration speed. Tailwind pairs with that model (utility classes colocated with the shadcn output) and avoids hand-rolling a CSS design system from scratch under time pressure.

## Zustand

Lightweight global state (used for the notification store) without Redux's boilerplate — appropriate since most state here is either server data (Supabase) or local component state, and only a thin slice (notifications) needs to be globally shared.

## @sjsu.edu-restricted auth

This is a campus-specific social app — allowing arbitrary emails would let anyone claim to be an SJSU student, undermining the "find peers at your school" premise. Domain-restricted signup (`validateSjsuEmail`) is a cheap, meaningful trust signal without needing full SSO integration with the university.

## OpenAI API — optional, template fallback

Same reasoning as the Supabase fallback: the app was built in an environment with no OpenAI key available. Rather than blocking match explanations / conversation starters / pod blurbs on an API key that might not exist, the app generates that copy from structured data (shared classes, interests, availability) deterministically. It's also arguably *better* for a demo — the explanations are guaranteed relevant and reproducible instead of subject to LLM variance.

## PWA (manifest + service worker + offline page)

The product is explicitly mobile-first (`manifest.json`'s `display: standalone`, `orientation: portrait`) — a PWA gets you an installable, app-like experience on students' phones without the overhead of shipping to the App Store/Play Store, which is out of scope for a hackathon timeline.

## Vitest

Fast, native ESM, minimal config — chosen over Jest most likely for setup speed and a quick watch loop, consistent with a modern toolchain. Its presence at all (52 tests targeting the matching engine specifically) signals the matching logic was treated as the one piece worth guarding with tests, since it's the app's core differentiator.

## pnpm

Faster installs and disk-efficient via its content-addressable store, plus native workspace support (`pnpm-workspace.yaml`) if the project ever splits into packages — a reasonable default for a team that wants quick `pnpm install` cycles during a hackathon.

---

**Caveat:** the Supabase-fallback and OpenAI-fallback rationale above is confirmed by explicit code comments and the original build environment's constraints. The rest (framework/library picks) are inferred from what each choice optimizes for — there's no separate design-decision log in the repo recording the original reasoning firsthand.
