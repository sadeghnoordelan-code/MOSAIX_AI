# Owner motion and portrait update — 2026-10-05

Implemented scoped owner requests: preserve perspective card arrangement; use the reference video after second 4 as the entry-motion reference; align founder portrait visible heights; animate both blue floor rings continuously and add selection-triggered motion.

Reference MP4 SHA256: E49C3919FC93200125801DC72979D9C319A8B71D79A1211C33A72D21B5B13049. The supplied copy matches the archived reference. Entry motion interprets the wipe/reveal sequence using the MOSAIX navy/blue palette: upward curtain followed by staged typography; release coordinates with the first decoded service-video frame and has a bounded fallback. Original videos remain independently looping.

Two masked conic light orbits run at different speeds and directions, with a subtle breathing halo. Changing selection remounts a short expanding light pulse and beam. Reduced-motion preferences retain static rings and direct navigation.

Portrait normalization uses existing PNG alpha bounds, without changing image pixels or proportions. At a 600px reference container, visible tops are 0.00px / 0.03px and visible heights 600.00px / 599.97px.

Validation: ESLint passed with zero warnings; TypeScript passed; final Next production build exited 0 (17 generated pages). HTTP verification passed 18 routes, 12 unique homepage links, robots/sitemap and video byte-range response. All five service-world checks passed.

Live IAB verification became available: screenshot showed both luminous rings; read-only computed styles showed active ring-orbit-motion with distinct changing orbit angles. Wheel/card selection changed the active service. Website card navigation reached its service page; browser error/warning log was empty at that point. Subsequent browser state changed during inspection, so do not claim complete uninterrupted video/scroll, portrait visual or all viewport QA. Hero approval remains pending. Local production server runs at http://127.0.0.1:4180; no publication.

## Blue orbit sphere and electric waves — 2026-10-05
Owner requested a continuously orbiting blue sphere, sudden acceleration on card changes, and sinusoidal blue electricity along both rings. Implemented a shaded glowing sphere with continuous phase; real selection changes trigger 1.3 seconds of acceleration (0.55 to 3.8 rad/s target), followed by damped return. Static SVG sinusoidal ellipse paths carry moving luminous dash segments in opposing directions. Reduced-motion stops movement; animation frame cleanup cancels on unmount. No images, source videos or Hero changes.

ESLint exited 0; production build and TypeScript compilation exited 0. All five service-world checks passed. Live IAB confirmed changing sphere position, active ring-current-flow on both paths, and next-card selection to Applications; screenshot showed electric trails on both rings. No publication.
