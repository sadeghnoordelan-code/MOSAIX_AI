# MOSAIX — recovery after external portfolio links
Date: 2026-10-12. Canonical project: E:/MOSAIX_AI/Projects/MOSAIX-AI Website.

## Reproduction and correction

The previous focus/visibility handlers did not recover a pause that arrived after page activation. The diagnostic reproduced both Website background and selected preview remaining paused in Chromium and WebKit after a delayed pause. Moving from the preview to its live-site CTA also cleared hover intent. On mobile, scrolling from the preview to the CTA cleared selection through IntersectionObserver.

Playback intent is now independent of media suspension. The shared keep-video-playing controller handles visibility, page restoration and freeze/resume, retries transient AbortError, and recovers unexpected pauses after activation. A one-second progress check is active only while the selected media is visible; it stops while the document or preview is hidden. There is no per-frame application polling. Muted inline playback is restored without rewinding the source. Autoplay denial has a visible manual retry and does not create a retry loop.

The portfolio keeps the selected project while opening its external link. Desktop hover remains active across the same project's preview and copy; real pointer exit can stop it. Viewport changes suspend playback without discarding the selected project. Returning to an offscreen preview requires bringing it back into view, but does not require pressing Play again. Only one preview can play. Explicit user pause remains paused after focus restoration.

Source files:
- src/features/media/keep-video-playing.ts
- src/features/services/website-portfolio.tsx
- src/features/services/service-world-video.tsx

## Final verification

Production build (including TypeScript), standalone typecheck, and final lint passed.

scripts/verify-portfolio-return-resilience.mjs:
- 16 actual external-link returns: all four sites × Chromium/WebKit × desktop1440/mobile390.
- Return checked without injected focus events, re-hover or replay clicks. On mobile the preview is scrolled back into view after the CTA; it resumes automatically.
- 16 separate deterministic delayed-pause races after activation.
- Four context checks for hidden-page pause, page restoration, freeze/resume, explicit user pause, exclusive playback and offscreen pause.
- Two additional Arabic mobile contexts passed.
- Actual frame presentation is checked with video frame callbacks where available; WebKit uses changed decoded canvas pixels and advancing native media time. All tested contexts had zero page errors.

scripts/verify-return-media-errors.mjs:
- Four checks passed: transient AbortError and autoplay denial/manual retry in both engines.
- Denied autoplay does not trigger indefinite play attempts.

Evidence:
- docs/evidence/playback-return-2026-10-12/results.json
- docs/evidence/playback-return-2026-10-12/failure-recovery.json

Native popup return checks are distinct from synthetic hidden/freeze/delayed-pause fixtures. These are browser-engine checks, not physical Android/iPhone coverage. Existing Arabic localization, links, media assets, API/admin and domain/indexing configuration were preserved.

No MOSAIX public push/deployment was performed. Local preview is http://127.0.0.1:4180/ (session57935). A browser tab already open on the previous build must reload once to obtain the new scripts. Heartbeat remains paused.

