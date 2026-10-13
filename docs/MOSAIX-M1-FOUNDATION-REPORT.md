# MOSAIX — M1 FOUNDATION REPORT
Status: IMPLEMENTED AND VERIFIED. Date: 2026-10-03.

Built: Isolated Next.js/strict TypeScript foundation with responsive black/navy typography and glass shells, semantic navigation/routes, service/media/project registries and local preview.
Left: Physical Hero rendering is M2; card video transmission M3; full Service Worlds, portfolio, operational backend/admin and Assistant remain in their dedicated milestones. No public deployment or business delivery is claimed.

## Actual execution model
M1 was executed in this conversation by GPT-6.1 Sol with Low effort. The current session JSONL turn_context and collaboration_mode.settings explicitly reported model=gpt-6.1-sol and reasoning_effort=low. No model/effort switch occurred. Earlier M0 recommendations were proposals, not assertions about the active model. Owner subsequently explicitly selected delegation of M2 Hero to GPT-6 Astra with High effort. The supervisor remains the current Sol/Low session.

## Implementation
- Next.js 16.3.8, React/React DOM 19.3.0, TypeScript 6.0.2; npm exact dependency pins and package-lock.json.
- Reusable responsive shell, design tokens, typography and static glass service family. System fonts used because no licensed brand font was supplied. Text wordmark is not presented as an approved custom logo.
- Exact five-service titles and shared route/media mapping; six byte-identical served MP4 copies.
- Discriminated project availability schema and negative checks for invalid URLs/relationships. Published project registry is empty; no invented live links.
- All public route foundations and complete semantic 404s. Service slugs are allow-listed by generated paths; unpublished project/Lab/admin paths return actual 404s.
- Contextual service ID preserved on request route. Enquiries/bookings explicitly unavailable and collect no user data.
- Metadata/robots/sitemap foundations. Preview is noindex; canonical origin remains unset until a real domain is approved.
- Native mobile menu supports keyboard open, Escape close/focus and closes on navigation. No scroll lock.

## Acceptance evidence
| Check | Actual result |
|---|---|
| npm run lint | Exit 0, no warnings/errors |
| npm run build | Exit 0; 16 static pages generated; known service paths generated |
| npm run typecheck | Exit 0, strict TypeScript |
| npm run test | 5 tests passed, 0 failed; duplicate/dangling relations, repository-as-live, unsafe destinations and case-study external CTA rejected |
| npm run verify:media | All 6 original and served copies match recorded SHA256 and size |
| node scripts/verify-http.mjs | Exit 0; 18 expected route responses; semantic main/h1/lang and noindex checked; 11 unique homepage internal links HTTP 200 |
| MP4 delivery | HTTP 206 for bytes 0-31, 32 bytes returned, video/mp4 MIME |
| Browser responsive review | Home inspected at 360/390/768/1280/1440 px; 390 rechecked separately after an early resize race. Services index verified at all five actual widths; no horizontal overflow |
| Mobile menu | Enter -> open=true; Escape -> open=false and SUMMARY focus; Services navigation -> correct page and menu closed |
| Browser console | Connected in-app browser warn/error log query returned empty array after current built preview navigation |
| Production dependency audit | npm audit --omit=dev --json: 0 vulnerabilities |

Initial tests identified strict narrowing and incomplete HTML fallback on unpublished routes; both were corrected and final build/type/route checks repeated. Next output:standalone was removed because the standard next start workflow must not warn or require unconfigured media/static copying.

## Limits and dependency risk
Full npm audit still reports 5 high findings propagated through one braces denial-of-service advisory in development glob/lint dependencies. Registry latest braces is 3.0.3 and the automatic proposed remediation downgrades eslint-config-next to an incompatible major version; no blind force downgrade was applied. These tools do not accept visitor input and are not in runtime dependency audit. This is a known development-tool limitation, not a claim of a fully clean full-tree audit. ESLint 9.39.5 also reports a version-support deprecation notice; lint itself passes.

Browser evidence is desktop Chromium in the in-app browser with viewport changes, not real iOS/Android or Safari certification. Reduced-motion CSS is implemented; OS preference switching was not simulated. No Hero/card visual fidelity, media playback quality, backend delivery or independent cross-family code review is claimed in M1. Browser screenshots were visually inspected through connected browser tools.

## Decisions taken
Native Next.js retained per approved architecture rather than adopting a Sites starter/hosting stack. Built-in Node test runner verifies registry behavior without adding another test dependency. No GSAP/Three/WebGL dependency installed in M1 because no active animation requires them. No fake forms/admin/portfolio content. Local preview remains at http://127.0.0.1:4180 during ongoing project work.

## Next authorized task
M2 Hero only, delegated to GPT-6 Astra with High by explicit owner selection. Preserve all approved priorities and require owner's visual approval after concrete implementation/evidence. M3 is not included in M2.

RULES DELTA: NO DELTA.
