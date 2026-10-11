# MOSAIX — owner refinements, security and SEO review

Date: 2026-10-11. Project: E:/MOSAIX_AI/Projects/MOSAIX-AI Website. Framework: Next.js 16.3.8 / React 19.3 / TypeScript 6. Intended hosting: GitHub + Vercel. No production domain has been purchased (owner confirmed). No public deployment or external account change was made.

## Delivered changes

- The same animated MOSAIX orb is now 132 px on desktop and 108 px on mobile, with a dismissible glass bubble: **Hi, I am MOSAIX. How may I help you?** The delayed welcome uses the same wording. The chat remains a dialog in the current page.
- Phone digits use an isolated left-to-right element and consistent Arial/Helvetica tabular numerals. Contact icons and official destinations remain intact.
- Portfolio previews reload when the owner changes a video's source. Hover/touch playback, exclusive playback and pausing offscreen remain intact.
- Hero playback can recover after an initial autoplay denial when the visitor interacts. Service films have a clear retry action, gesture/page-return recovery and cancellation of stale readiness notifications. Loading no longer erases an autoplay-denied state; actual media failures are distinguished from denied autoplay.
- The Hero scroll control reserves space for the larger floating assistant.
- Added the original MOSAIX mark as the browser icon and a branded 1200 × 630 social image. Fixed the missing-icon 404 and the unsupported Safari viewport option. VisualViewport keyboard handling remains in use.
- Added per-page metadata and conditional canonical links, Organization/WebSite/Service structured data and publication-aware sitemap entries. JSON-LD escapes HTML delimiters. Brand names are not appended twice to titles.
- Preview indexing fails closed. Without an approved SITE_URL and SITE_INDEXABLE=true, robots disallows crawling, HTML and response headers include noindex, and the sitemap contains no URLs. Vercel previews remain non-indexable even if the production flag is set. The unpurchased collateral domain was removed from the About page.
- Added a unique nonce Content Security Policy for each HTML response, with no production unsafe-eval or unsafe-inline script permission. Required animation styles remain allowed. Added Permissions-Policy; HTTPS HSTS is conditional on a future approved HTTPS origin. Admin/API responses are noindex. CSP allows the actual Vercel Blob upload endpoint and its approved storage hosts.
- Safe error pages offer retry/home actions without displaying internal errors.
- SEO tests now run in build:verified, including GitHub/Vercel builds.

## Implementation files

- src/features/ai/assistant-launcher.tsx, src/features/cms/defaults.ts, src/styles/global.css: orb size, bubble, dismissal, chosen wording and phone/retry/error styles.
- src/components/contact-links.tsx: phone isolation and numeral font.
- src/features/hero/hero-experience.ts, src/features/hero/hero.module.css: playback recovery and control clearance.
- src/features/services/website-portfolio.tsx, service-world-video.tsx: source changes and media recovery.
- src/proxy.ts, next.config.ts: CSP, response protections and preview indexing guard.
- src/lib/site.ts, src/components/structured-data.tsx: origin/indexing validation, metadata and safely serialized structured data.
- src/app/layout.tsx and page.tsx: viewport, indexing defaults, home metadata and factual Organization/WebSite schema.
- src/app/services/page.tsx and services/[slug]/page.tsx: list/detail metadata and conditional Service schema.
- src/app/projects/page.tsx, projects/[slug]/page.tsx, lab/page.tsx and lab/[slug]/page.tsx: metadata for approved published content.
- src/app/about/page.tsx: hide the unset domain. src/app/admin/[[...path]]/page.tsx: private title without duplicated brand.
- src/app/robots.ts, sitemap.ts, icon.tsx and opengraph-image.tsx: crawler gates and brand assets.
- src/app/error.tsx and global-error.tsx: safe recovery UI.
- tests/seo.test.ts and package.json: automated indexing/JSON-LD checks in the deployment build.

## Baseline and findings

P0/P1: no concrete exploitable application issue was found by the independent manual security review. This is a scoped assessment, not a security guarantee.

P2, fixed: missing favicon response; inconsistent phone typography; lack of a prominent assistant introduction; stale preview source after CMS edits; missing autoplay recovery; load events hiding denied-playback recovery; stale presented-frame notifications after pause; preview indexing insufficiently tied to an approved domain; duplicated brand titles; unsupported viewport directive in WebKit; overlap of the larger orb and scroll control.

Development dependency issue: the full npm audit reports five high entries from one upstream braces advisory propagated through ESLint -> fast-glob -> micromatch -> braces. Installed/latest braces is 3.0.3, with no patched registry release at review time. The suggested major downgrade to eslint-config-next 14.2.35 was not applied to a Next 16 project. Production-only audit reports **0 vulnerabilities**. No public input path into developer glob patterns was found. This is not an assertion that the full development audit is clean. Maintenance owner: MOSAIX project maintainers; recheck before the first production release and when upstream publishes a fix. No human risk acceptance is inferred.

Source/client scans: no complete credential patterns or actual configured server-secret values were found in the current public bundle. Environment access remains server-side. Git has no commits, so there are no historical snapshots to scan or revoke on this evidence. Final raw JavaScript size is recorded in security-scan.json; it is a sum of all emitted chunks, not one page's transferred size. No declared total-bundle budget exists.

No source TODO/FIXME/debugger/console.log matches were found by the production-source sweep. Tests use synthetic protocol/autoplay/security fixtures only in test scripts; they are not shipped assistant replies. Empty Projects/Lab publication states remain explicit and have no fabricated case studies.

## Independent security review

The owner's security skill explicitly required a different model family. A report-only GPT-5.6 Sol subagent reviewed the code; it did not edit source or run exploit tests. Root-agent HTTP/browser tests are listed separately.

| Category | Result |
| --- | --- |
| Authorization | Owner session required for private content/history/media/connection operations; no concrete bypass found. |
| Input validation | Bounded JSON, strict CMS shape, safe URL/media validation, fixed storage paths and canonical route context; no concrete exploit found. |
| Secrets | Server-side environment access; no credential exposure found in the reviewed source/current bundle. |
| Error exposure | Generic API errors; no internal paths, stack/provider bodies or transcripts exposed in reviewed responses. |
| Rate limits | Login and paid generation requests limited; no concrete unbounded public expensive path found. |
| File uploads | Owner + origin + CSRF required, constrained extensions/MIME/size/expiry, random suffix, no overwrite. Magic-number validation is absent; no attacker privilege gain was established without already possessing owner access. Media is intentionally public. Real cloud upload remains untested without a token. |
| Sessions/auth | Random signed expiring owner session, HttpOnly/SameSite Strict, secure production configuration and timing-safe checks; no concrete bypass found. |
| CSRF | Origin and per-session token required for cookie-authenticated mutations. |
| Webhooks | None implemented. |
| Server-side URL fetching | CMS URLs are rendered, not server-fetched. Legacy model URL is env-only and loopback-restricted; no concrete SSRF path found. |
| Private storage | Keyed private owner/conversation storage; public uploaded website media is intentional. |

## Verified evidence

Evidence directory: docs/evidence/audit-2026-10-11/.

- npm run lint, npm run typecheck and node --test tests/*.test.ts: all 29 tests passed; production builds passed after relevant changes. Later targeted SEO tests and builds also passed.
- verify-owner-refinements.mjs: Chromium/Edge and WebKit, widths 1440/390. All four destinations clicked/tapped twice per context: **32 successful real tab openings** with exact expected URLs, including Harvest's query string. Orb sizes, bubble visibility, chat open/close, phone font/direction and no horizontal overflow passed. Zero application page/console errors. Screenshots inspected on desktop and mobile.
- verify-headers-seo.mjs: 16 known/unknown routes have expected HTTP statuses, titles, descriptions, English language, preview noindex, safe headers and nonce-bearing inline framework scripts. Public pages have one H1. Unconfigured domain yields no canonical claims and an empty sitemap. PNG icon/social image return 200. Nonces differ across requests. An untrusted script inserted in the delivered HTML is blocked by CSP. A DevTools-created trusted dynamic-script fixture was replaced by this realistic parser-inserted test; no protection claim relies on that initial fixture.
- verify-admin-http.mjs: real owner login, HttpOnly/SameSite cookie, cross-origin rejection, wrong password, missing-CSRF rejection, unsafe media URL rejection, stale-revision conflict, real content save visible publicly, restoration of original content, logout invalidation and route checks passed. No credentials printed. OpenAI availability remains false without a key.
- audit-security-local.mjs and npm audit reports: no current source/bundle credential exposure, production audit 0; development advisory documented above.
- Live external samples: all four return 200 and load expected hero media in desktop and mobile Chromium. SARV/BOREAL/Harvest use scroll-controlled films; a paused media element is not by itself a fault. Lumiere uses looping playback on coarse-pointer/mobile. A superseded video range request was aborted in Lumiere while playback continued. WebKit-on-Windows remote/blob media results are inconclusive; no claim of physical iPhone playback is made. No live external site was modified or redeployed.

Final media/hover/mobile acceptance results are appended below once completed. Earlier failed or interrupted harness runs are not presented as passed. The WebKit readiness check now waits for an actual presented frame and intrinsic dimensions rather than assuming readyState alone is enough.

## SEO / AI search readiness and limits

Canonical and entity URLs are generated only from a future owner-approved HTTPS origin. Structured data contains visible brand, contact and service facts; no prices, offers, ratings, credentials or testimonials were invented. Search access and training access are distinct: OAI-SearchBot controls OpenAI search crawling, while GPTBot relates to model training. Current preview denies all crawling. Production crawler choices must reflect the owner's preference when the domain is configured. No llms.txt ranking claim, tracker or analytics service was added.

Official references reviewed: [Google canonicalization](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls), [Google robots meta](https://developers.google.com/search/docs/crawling-indexing/robots-meta-tag), [Google Organization data](https://developers.google.com/search/docs/appearance/structured-data/organization), [Bing Webmaster guidelines](https://www.bing.com/webmasters/help/bing-webmaster-guidelines-30fba23a), [Bing robots.txt](https://www.bing.com/webmasters/help/how-to-create-a-robots-txt-file-cb7c31ec), [OpenAI crawlers](https://developers.openai.com/api/docs/bots).

**Not measured:** real-user LCP/INP/CLS at the 75th percentile, field traffic/conversions/organic queries, actual rankings or AI citations. Local synthetic frame sampling is not Core Web Vitals. No physical Android/iPhone, real iOS low-power/autoplay policy, actual on-screen keyboard hardware or all historical browser versions was tested. Public TLS/HSTS/CDN behavior and deployed Redis/Blob/OpenAI integrations cannot be verified before configuration/deployment.

Before indexing a future production site: configure the purchased domain as SITE_URL, connect storage/provider credentials privately using the deployment guide, verify the public HTTPS routes/canonical/schema/robots/sitemap, approve published content, then enable SITE_INDEXABLE=true in Production and redeploy. Preview flags remain closed. Search Console/Bing verification and sitemap submission require the actual domain/accounts; no indexing request has been sent. Review thin empty publication pages before public indexing. Future monitoring should cover indexing, organic queries/clicks/conversions, field CWV and verifiable AI referrals/citations; no visibility guarantee is made.

Existing owner setup guide: docs/OWNER-API-ADMIN-DEPLOYMENT-GUIDE.fa.md. Saving code locally is not deployment: a connected GitHub push and successful Vercel build are required. CMS edits persist independently once external storage is configured. No purchase, automatic public push or deployment was performed.

## Final acceptance — 2026-10-11

Final source production build and its TypeScript check passed after the paused-frame guard and Hero control-clearance changes. Final original/served media SHA256 checks passed for all six assets; all **29 tests** passed again.

- **24 portfolio preview checks**: four cards × widths 1440/390/320 × Chromium/WebKit. Mouse hover/native tap, one playing preview, pausing offscreen, lazy sources, decoded media and no horizontal overflow passed; zero page errors.
- **10 service-film checks + two denied-autoplay scenarios**: all five worlds in Chromium/WebKit present frames and keep advancing, use object-fit cover, and resume after a visitor gesture. Denied autoplay exposes the retry button; clicking/tapping it resumes the service film. The homepage Hero also recovers through its light-exploration control. Evidence: video-recovery.json. Test fixtures deny play and remove the contradictory native autoplay attribute only in intercepted test documents; no fixture behavior is shipped.
- **Eight final layout checks**: Chromium/WebKit at 1440×1000, 390×844, 320×740 and 844×390. Exact selected bubble wording, unobscured Hero scroll control, no horizontal overflow and fitted chat/composer passed. Screenshots were captured; final 390px screenshot inspected.
- **Main mobile behavior**: 44px touch targets, swipe rotation, native preview-button activation, exclusive/offscreen pause, menu navigation, resized keyboard-like chat space and no-WebGL Hero fallback passed. The raw CDP swipe and subsequent native tap were tested in separate documents: mixing those injection methods suppressed a compatibility click in the harness, without dispatching a click to the application. That failed mixed-input scenario is retained as a test limitation; immediate post-swipe behavior on a physical handset is not claimed verified.
- **Synthetic CPU4x frame sample**: median 16.7ms, p95 33.2ms, two sampled intervals over 50ms. This is a 2.2-second headless stress sample, not a real-user percentile or universal phone guarantee. Evidence: docs/evidence/mobile-matrix/behavior-final.json.
- **Final emitted JavaScript total**: 838,039 raw bytes across all chunks, not initial page transfer. Final source/client secret scans have no findings. Production dependencies are unchanged from the zero-vulnerability audit; the full development advisory remains documented above.

Preview is local only at http://127.0.0.1:4180/ (current tool session 95166; inspect actual process state before restarting). Owner admin remains /admin. Existing private credentials are in the ignored .local-admin/owner-credentials.txt; do not expose them. OpenAI/Redis/Blob production configuration, purchased domain, physical-phone acceptance, Search Console/Bing and real-user metrics remain outstanding external setup items. Heartbeat stays paused. No public push/deployment or model-setting change is claimed.
