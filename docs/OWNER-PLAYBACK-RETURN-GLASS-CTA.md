# Playback return and glass portfolio CTA — 2026-10-11

## Completed MOSAIX changes

- Portfolio preview intent is retained when the document becomes hidden. Media pauses while hidden; visibility return, focus and pageshow resume the selected preview. pagehide pauses it. Cleanup cancels stale play attempts; a media error is reloaded on retry. IntersectionObserver still stops offscreen previews, so only the selected visible preview plays.
- Service-world background film also recovers on focus and pageshow, reloads a failed decoder, pauses on pagehide/hidden, and avoids starting while hidden/disposed.
- The live-site links are now rounded glass buttons: approximately 71px high, 20px desktop/17px mobile text, translucent blue gradient, subtle blur/halo, visible focus treatment and restrained hover motion. Reduced-motion users receive no transition.

Production build with TypeScript and ESLint passed. Edge and WebKit desktop1440/mobile390: all 16 portfolio cases passed visibility pause/resume, focus recovery after a forced interruption, pagehide/pageshow recovery, exclusive playback, actual external-link open/close followed by hover/tap playback, background resume and button geometry/hit targets. No page errors or horizontal overflow. Both desktop and mobile screenshots were visually reviewed.

Evidence: docs/evidence/audit-2026-10-11/return-playback.json and glass-explore-*.png. scripts/verify-portfolio-return.mjs uses synthetic hidden/pagehide/focus events for reproducible lifecycle interruptions plus actual link popups. This is not physical handset or real OS background-suspension coverage.

## BOREAL: independently owned deployed site

Remote: https://github.com/sadeghnoordelan-code/Premium-real-estate-website
Live: https://real-estate-website-blond-phi.vercel.app/

Warm direct visits scrubbed correctly. A cold visit opened from MOSAIX reproduced the owner report: before media readiness, wheel input was ignored, scrollY reached3000, target remained0 and the video never entered the intended scroll timeline. A deterministic delayed-media regression reproduced this in both engines: baseline target0/scrollY1440, even after media became ready.

The existing E:/Ai web 2 checkout was older than the deployed source. origin/main was fetched; an isolated checkout was created at E:/MOSAIX-AI/boreal-playback-review from dc61f3b. The original checkout and its local files were not reset.

Patch: js/hero.js now holds the initial hero scroll position and accumulates wheel/touch/keyboard intent while loading. Once media is ready it renders the requested position. Existing failure paths release the lock if both media renderers fail; menu, booking, pinch zoom and navigation exclusions remain. Focus/pageshow/visibility return reissue the current seek, preventing stale decoder state from surviving a tab return. js/bundle.js was regenerated from the modules for the filesystem fallback.

Verification against the same delayed first-frame load:

- Chromium baseline target0/y1440; patched target97/y0 and decoded time3.25s.
- WebKit baseline target0/y1440; patched target113/y0 and decoded time3.79s.
- Both patched engines continue scrubbing after focus restoration and release page scroll after the film ends.
- Two mobile touch/keyboard cases passed queued input, Home rewind and End final decoded frame.
- Two forced media-failure cases reached the final fallback frame195 in both engines (WebKit approximately194.995).
- Both module and generated bundle passed syntax checks. No browser page errors in the input cases.

Evidence in E:/MOSAIX-AI/boreal-playback-review/verification/hero-loading-results.json, hero-input-results.json and hero-fallback-results.json. Tools: verify-hero-loading.mjs, verify-hero-input.mjs --input-only, verify-hero-fallback.mjs. The original network-abort fallback fixture timed out in WebKit because media routing is bypassed; the final fixture forces an actual missing source and passes. The initial keyboard check incorrectly read a wheel-only diagnostic target; final checks use the rendered timeline and decoded media.

BOREAL preview: http://127.0.0.1:4182/ . MOSAIX preview: http://127.0.0.1:4180/ . The owner explicitly authorized BOREAL publication. Commits b5f0338468b2144568effa09111efa48d2035a32 and b67c778a8d15d4678a94afcb2f72930bbb660b6d were pushed to main. Vercel reports success and the live source contains the final native-seeking guard. The original clean E:/Ai web 2 checkout was fast-forwarded to b67c778. MOSAIX itself has not been publicly pushed or deployed; domain/OpenAI/cloud configuration is unchanged.

A real remote WebKit media seek exposed an additional bug: the former 1500ms watchdog interrupted slow native decoding and left the final requested frame stale. The final patch waits for native video.seeking to complete, retains the latest requested frame and verifies actual decoded time before treating a seek as idle. Real remote media forward/reverse checks passed in Chromium and WebKit. Final production tests opening BOREAL from the actual MOSAIX link passed in both engines: queued wheel during cold loading, decoded requested frame, reverse scroll, and End releasing page scroll. No page errors. Evidence: docs/evidence/audit-2026-10-11/boreal-production.json; remote-seek-results.json in the isolated BOREAL verification folder. These are browser-engine tests, not physical handset coverage.
