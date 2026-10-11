# Owner blank admin / glass cards / toroidal light motion — 2026-10-09

## Result
The owner's blank /admin report was reproduced as an actual empty browser screenshot. The fixed ambient background painted over normal-flow admin content. HTTP 200 and DOM hit testing did not prove that pixels were visible: pointer-events:none allowed hit testing through the covering layer. Admin now has a positive positioned stacking layer and an isolated route wrapper. Login and authenticated editor are visually confirmed on desktop and mobile.

Idle service cards now use genuinely translucent backgrounds and clear reflective gradients. Opaque video/material/readability layers were removed from the idle view, and the rear ring arcs sit behind the lower glass. Desktop card spacing prevents neighboring typography showing through overlapping cards. Rounded corners and perspective selection remain. Original videos and assets are preserved.

Performance: one renderer owns two rings, the orbiting blue sphere and coherent light strands; the old independent sphere DOM loop and conic-gradient orbit animations are gone. The static ring plate is cached; dynamic geometry reuses a typed buffer. Pixel ratio is capped at 1.25 and drawing pauses offscreen, in hidden tabs and under reduced motion. Idle card videos have no source and preload:none. Explicit Preview loads/plays only the chosen video; changing cards pauses it immediately. Card render components are memoized. Heavy opaque backdrop blur and side-card brightness filter are removed.

Light paths use real 3D torus coordinates: radial distance changes with cos(twist), height with sin(twist), and the centerline runs in X/Z. Perspective projection changes near/rear scale. Tube-facing classification and draw order tuck the rear part of each strand behind the tube, then reveal the front. Card changes smoothly increase angular speed and energy, with continuous phase and gradual deceleration. The old flat drifting-wave paths are replaced.

## Evidence
- All 26 tests passed (including two torus geometry/projection tests), ESLint passed, final production build/TypeScript passed.
- Real HTTP owner auth, origin/CSRF rejection, invalid content rejection, stale revision, public content write/restoration, logout and public routes passed.
- Independent headless Microsoft Edge rendered desktop 1440x1000 and mobile 390x844. Reviewed actual login, authenticated editor, glass cards and mobile editor screenshots. Mobile cards have no horizontal overflow; reduced-motion keyboard selection works.
- Preview playback succeeds, and selection change stops it. Hover no longer starts decoding video: Preview is the explicit playback control.
- Matched pointer/wheel scenario before/after: p95 frame interval 33.5ms → 16.9ms; frames over 50ms 7 → 1. The median remained 16.7ms. Unrequested playing videos 1 → 0. These are synthetic headless measurements on this host, not a guarantee for every device.
- Before/after images and raw metrics: docs/evidence/visual-fixes/. Admin-before.png shows the blank page; admin-after.png and admin-editor-after.png show visible content. Cards-after.png shows the complete rings and transparent cards.

Local production preview session: 87213, http://127.0.0.1:4180. Refresh the existing browser tab for the new build. No public deploy or OpenAI key/model activation occurred. Current API/admin owner guide and credentials remain valid. The normal CUA kernel failed initialization; the approved bundled browser automation runtime provided the independent rendering evidence instead.
