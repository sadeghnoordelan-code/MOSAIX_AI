# Unified typography and release review — 2026-10-13

## Resulting behavior

Arabic public copy uses Changa consistently, including the three-line Hero title, captions, navigation and Arabic chat. The actual inconsistency was caused by both a Hero CSS override and old font variables in SiteChrome; both were corrected. English defaults to locally hosted Space Grotesk Variable across pages, controls and chat. The Arabic-only Changa subset lets Latin characters resolve to Space Grotesk in mixed-language copy. The owner font setting now applies to the whole content wrapper; older supported Raleway choices retain their local font definitions. The default owner setting is Space Grotesk Variable. Card dimensions, shape, placement and ring geometry are unchanged.

Font assets are pinned/local, with OFL licenses included. Space Grotesk source: https://fontsource.org/fonts/space-grotesk/about ; pinned Fontsource distribution 5.3.0. No runtime font CDN dependency was added.

## Local verification

- Final source: 34 project tests, lint, production build and TypeScript passed. Final four Chromium/WebKit language checks confirmed matching Hero/paragraph font families and owner-font propagation after the last wrapper change.
- 124 English/Arabic route-layout/image/font checks across Chromium and WebKit at 1440, 390 and 320px passed. All page images were decoded, no horizontal overflow, and all five service background videos advanced in 40 playback cases. Chat opening/closing and language-switch typography were checked.
- Ten carousel checks passed click/tap focus, forward/reverse loops, page scrolling outside cards, original card dimensions, and no arrow on other pages.
- Sixteen portfolio cases passed popup return, home/card re-entry without document reload, native history return and decoded-frame progression; missing-pageshow/pending-play recovery, explicit pause and offscreen pause passed. This final pass used explicitly marked external-document fixtures to isolate MOSAIX from transient external networking. An earlier live desktop pass visited all four real destinations and passed all three return paths; the live mobile SARV popup encountered a connection error. A subsequent direct live SARV request returned HTTP200. Do not represent the isolated pass as sixteen successful live external-site visits.
- Actual Arabic mobile client navigation through Website, home and Studio passed in both engines with zero page errors. Forced document-replacement matrix testing once produced two WebKit cancelled RSC-prefetch access-control messages; the narrow rerun and real client journey passed. These warnings are preserved as a qualification, not hidden by application error suppression.
- Owner login/read/logout, HttpOnly/SameSite cookies, bad origin rejection and missing-CSRF rejection passed, without modifying site content. Actual owner content reports the new default font. OpenAI remains not_configured.
- Original/served media hashes matched for all six registry films. Secret/file-limit release audit excludes environment files, owner credentials, local data, build output and model files. No real credential match or file above GitHub's 100MiB limit was found.

Evidence: docs/evidence/release-2026-10-13/ ; the matrix results plus narrow-arabic.json total124 cases. These are desktop browser engines and viewport/touch emulation, not every physical handset. No claim of absolute zero bugs, live AI quality, field performance or cloud deployment is made.

## BOREAL entry repair

The previous 1500ms preloader cap could expose the hero before video readiness. Entry now waits for the complete selected video download and native decoded playback readiness (canplaythrough/complete buffer). Download progress is real and monotonic; HTTP cache is used rather than an incompatible temporary blob source. Downloads/decode/fallback have bounded failure paths; the existing frame-sequence fallback remains available.

Eight Chromium/WebKit desktop/mobile cases passed a deliberate 4200ms network delay and unavailable-video fallback. Loader remained closed before readiness; native forward/reverse seeking and fallback final frames worked. WebKit's media backend can report empty buffered ranges while readyState4 and playback are valid; readiness handles that correctly. JS syntax and regenerated classic bundle were verified. Original assets and story/input behavior were preserved.

Prepared source was copied to the clean original E:/Ai web 2 checkout (js/hero.js, js/main.js, js/bundle.js and tools/verify-prepared-entry.mjs). Both original and review checkouts retain the correction locally. Evidence: boreal-prepared-entry.json.

## Publication gates

A fresh browser check on 2026-10-13 still rejects github.com because of the saved user Block preference and explicitly prohibits an alternate-tool/route workaround. No GitHub upload or BOREAL live publication occurred. The original live BOREAL URL remains on its prior version. MOSAIX repository privacy and Vercel All Deployments authentication still require actual account verification; no private deployment URL is claimed. Readiness here means reviewed local source/package.

OpenAI/Redis/Blob credentials remain unconfigured; real AI replies and cloud persistence require the owner setup already documented. The site remains noindex without a purchased/approved domain. Heartbeat remains paused; shutdown is not appropriate while the earlier publication task is incomplete. No model/effort setting change, purchase or paid API call was made.
