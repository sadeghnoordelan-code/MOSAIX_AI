# MOSAIX OpenAI / owner admin / GitHub + Vercel — 2026-10-09

## Current authorization and implementation
The owner's latest direct choice supersedes the previous self-hosted-only gate: prepare OpenAI API infrastructure, a real owner admin, and GitHub + Vercel automatic deployment after push. No external accounts, purchases or public deployment have been performed. English remains first; never publish service prices, estimates or free-service promises. The assistant remains an orb and dialog within the existing site.

Implemented:
- OpenAI Responses adapter with server-only key, strict structured context, typed output-text streaming, store:false, timeouts and generic errors. No external tools or automatic sending.
- Shared temporary conversation context (30-minute TTL), request limits and per-session generation leases using Upstash Redis. Local development fallback; Vercel private features fail closed without Redis.
- Owner authentication: scrypt password hash, random signed session, 8-hour HttpOnly/SameSite cookie, secure production cookie, origin + CSRF checks, credential rotation and login limits.
- /admin content forms, projects and Lab publication, safe media URLs, Vercel Blob authenticated upload token issuance, connection checks, JSON export/import and revision history (last 20 versions).
- CMS default/override merge. All content edited in the owner panel persists independently of code deployments. Dynamic public pages render current content; unpublished entries are filtered from public data.
- GitHub verification workflow and Vercel function configuration. Build command npm run build:verified runs 24 tests, lint and production build.
- Private owner credentials generated in ignored .local-admin/owner-credentials.txt; environment file also ignored. No key or password printed.

## Frozen design decisions for auth/data/upload
Single owner role, no public sign-up, no payment processing. Authentication credentials are configured server-side, not editable through public content. Persist only owner content/history and bounded temporary chat context. Do not log transcripts or provider error bodies. Temporary context can be cleared from chat. Media is public website content, not private documents. Upload allowlist PNG/JPEG/WebP/MP4, 200MB, owner-only issuance, no overwrite, 5-minute token. No SVG/HTML/executable uploads. Preview and Production namespaces must be separate. Structural/animation code changes remain Git-maintained.

## Verification and limitations
24 automated tests and a production build passed on this implementation; final source verification and live HTTP checks are recorded below when complete. Tests exercise authentication rejection, CSRF/origin, invalid content and media URLs, stale revision conflicts, recovery history, shared leases, private context clearing, Responses store:false/strict schema and exclusion of reasoning events. OpenAI tests use synthetic protocol fixtures: they are not real model quality evidence.

No OpenAI key has been provided. No actual answer generation, API account billing, Redis service, Blob service, GitHub remote or Vercel deployment has been connected/verified. Check connections verifies key/model access only once configured, not conversational quality. Actual conversation/pricing/English quality needs live acceptance after key setup. The browser automation runtime exited unexpectedly on two initialization attempts; no latest visual admin QA is claimed.

Runtime-only npm audit reports zero vulnerabilities. Full development audit currently reports five high entries in the existing ESLint → fast-glob → micromatch → braces dependency chain. Registry braces latest is still 3.0.3 and audit suggests downgrading Next's lint configuration to 14.2.35; that incompatible downgrade was not applied. Recheck the upstream advisory before release; this is tooling exposure, not a claim that the development audit is clean.

See OWNER-API-ADMIN-DEPLOYMENT-GUIDE.fa.md for owner entry and deployment steps. Never commit .env.local, .local-admin or .local-ai. The heartbeat remains paused. No larger local-model download or rejected-model activation is needed.

## Final local evidence — 2026-10-09
Final source production build and TypeScript passed after dynamic sitemap and uploaded-Hero CORS fixes. The prior full verification passed all 24 tests and ESLint. Real local HTTP verification passed: /admin 200; unauthenticated content 401; cross-origin login 403; wrong password 401; real owner sign-in 200 with HttpOnly/SameSite cookie; missing CSRF 403; unsafe media content 400; stale revision 409; successful CMS write visible in the real homepage; original content restored; logout invalidates session; public routes 200 and unknown detail/admin routes 404. OpenAI remains available=false without a key. Secrets were never printed. Source script: scripts/verify-admin-http.mjs.
Local production preview is running in tool session 98247 at http://127.0.0.1:4180. Inspect actual process state before starting another preview. No Git remote, push, public deployment or external account purchase occurred. Current task infrastructure is delivered locally; external setup, real model acceptance and latest visual admin review remain explicit limitations.
Later owner correction supersedes the earlier visual limitation: blank admin was reproduced as a screenshot, fixed, and visually verified using approved bundled headless Edge on desktop/mobile. Glass card performance and 3D toroidal rings also verified. See OWNER-GLASS-RINGS-ADMIN-FIX.md; latest preview 87213. Real OpenAI/external service setup remains pending.

2026-10-11 refinement/security/SEO checkpoint: real32 sample-link tab openings;24 hover/tap previews;10 service films and autoplay recovery;8 layout checks; current mobile behavior and29 tests/build/types/lint passed. No concrete independent manual security exploit or client-secret exposure found. Production audit0; five development entries from unpatched braces tooling chain remain documented. Owner confirms no purchased domain; preview remains noindex with an empty sitemap and no invented canonical. See OWNER-REFINEMENTS-SECURITY-SEO.md for complete evidence, limits and setup gates. Current preview95166. Real OpenAI/Redis/Blob and public deployment are still unconfigured; no physical-device or field-CWV guarantee is made.
