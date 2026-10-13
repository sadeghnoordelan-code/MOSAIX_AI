# Carousel focus, continuous loop and Arabic typography — 2026-10-13

A large cyan glass arrow appears at the bottom of the viewport only while a service card on the homepage is partially visible. Clicking/tapping it aligns the carousel or active card within the viewport using smooth scrolling; the arrow disappears when the card is fully visible or the visitor leaves the section. The native button supports keyboard activation, English/Arabic labels, safe-area spacing and reduced-motion preferences.

The wheel handler now rotates continuously in both directions, including last-to-first and first-to-last transitions. It captures the wheel only over actual cards when the active card is fully visible. Scrolling in the empty space beside the cards continues the page; a partially visible card does not trap page scrolling. Side-card selection and existing horizontal touch swipe remain available.

The owner's final instruction explicitly preserves all original card dimensions and shapes. Temporary responsive size changes were completely removed. No card width, height, border radius or transform was changed in the final source. On a viewport shorter than the original card, simultaneous full-height display is physically unavailable without resizing; normal page scrolling remains available. No all-orientation full-fit guarantee is claimed.

Arabic website/chat typography now uses locally hosted Changa Variable (200–800), from the pinned Fontsource 5.2.8 distribution. Arabic/Latin/Latin-ext WOFF2 files total 59,684 bytes; the SIL OFL license is included in public/fonts/changa/LICENSE. No runtime font CDN request is needed. English Raleway and the Latin MOSAIX wordmark remain unchanged. Source: https://fontsource.org/fonts/changa/about and https://cdn.jsdelivr.net/npm/@fontsource-variable/changa@5.2.8/wght.css . The unused prior Noto dependency remains installed; it is no longer imported into the application.

## Verification

Final 34 project tests, lint, production build and TypeScript passed. Application source was frozen before the final browser pass.

Five Chromium cases and five WebKit cases passed at 1440×900, 1280×720, 390×844, Arabic 390×667 and Arabic 320×740. Checks cover click/tap alignment, free page wheel before alignment, wheel rotation afterward, both loop boundaries without page movement, page scrolling outside the cards, hidden arrow in Hero/secondary pages, no horizontal overflow and no page errors. Original card width/height were asserted, and Arabic font faces were confirmed loaded. Arabic contexts also exercise reduced motion.

Chromium narrow contexts use mobile/touch emulation. WebKit narrow contexts use desktop WebKit with narrow viewport and touch enabled, because Playwright's mobile WebKit wheel API is unsupported; do not represent that as native mobile Safari wheel testing. The first WebKit pass encountered an assertion timing race after instant scrolling; a captured Hero screenshot already showed the arrow absent. The final WebKit pass waits for the actual scroll position and arrow state and passed all five cases. Chromium passed all five cases before that wait-only harness correction. No physical handset guarantee is made.

Evidence: docs/evidence/carousel-navigation-2026-10-13/webkit-results.json, arabic-mobile-arrow.png, arabic-mobile-aligned.png, english-desktop-aligned.png. Reproducible script: scripts/verify-carousel-navigation.mjs.

Current local production preview: http://127.0.0.1:4180/?lang=ar ; tool session 88337. Inspect process state before another startup. No network publication was performed; previous saved GitHub/Vercel permission blockers remain unresolved. No credentials, API configuration or indexing settings were changed.
