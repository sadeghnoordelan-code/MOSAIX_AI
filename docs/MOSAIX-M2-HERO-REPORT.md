# MOSAIX — M2 HERO REPORT

Status: IMPLEMENTED; automated checks VERIFIED; parent browser evidence pending below. Owner visual approval remains pending. Date: 2026-10-03.

Built: Native continuously playing Hero film under an independently rendered WebGL concealment material, with inertial local light, semantic typography, responsive exploration and complete teardown.
Left: Parent browser QA and Sadegh’s visual approval. Safari and physical mobile-device behavior require device evidence before certification. M3 video/glass cards and subsequent milestones remain outside this implementation.

## Implementation

- `hero-foundation.tsx` preserves the existing `HeroFoundation` export, supplied media registry, approved tagline, semantic h1, studio description and existing Services CTA. The control includes keyboard instructions and a discrete live media-status announcement.
- `light-material.ts` draws a premultiplied-alpha WebGL material over the native video. A high-exposure core, broad body and weak spill form the light; an oblique footprint, multiscale roughness and gently warped penumbra avoid a hard circle. Chromatic black, static fine grain and restrained directional sheen retain material depth.
- Only the illumination field transmits the already-playing film. There is no video texture upload, global video fade, CSS flashlight, circular clip, scroll scrubbing, generated artwork, extracted poster or modified media.
- `hero-experience.ts` owns imperative input, critically damped source dynamics and a single RAF loop. Source coordinates use CSS logical pixels, top-left origin and seconds; the shader explicitly converts WebGL’s bottom-left fragment origin. Pointer movement never calls play, pause or seek.
- Native muted inline looping playback starts independently. The opaque guard remains until both a decoded presentation frame and a rendered material exist. Errors, autoplay refusal and unavailable graphics retain concealment and report the real unavailable state. A 15-second startup/buffering threshold prevents indefinite loading claims. A later `playing` frame recovers readiness.
- Hover and primary-button drag reveal the film. Pointer capture supports dragging across the boundary. Touch uses native `pan-y pinch-zoom`, supports horizontal exploration and relinquishes control on vertical-scroll cancellation. The semantic light button supports arrows, Shift+arrows, Home, Escape and normal Tab navigation.
- Visibility and intersection suspension pause decoding/render work; returning resumes independently without seeking to zero. Page lifecycle events handle history restoration. ResizeObserver and device-pixel-ratio checks keep light coordinates stable after resize/orientation. Context loss immediately restores the opaque guard; context restoration recreates shaders and geometry.
- Reduced motion freezes procedural material drift and removes source inertia. The supplied film retains its explicit continuous-playback contract; no substitute image or different reveal technique is introduced.
- Teardown aborts event listeners, disconnects observers, cancels animation/video-frame callbacks and timers, deletes GPU resources, releases capture and unloads the native media resource. Effect setup restores the video source for React Strict Mode’s setup/cleanup probe.
- `hero.module.css` isolates the full-bleed composition, HTML readability, compact exploration cue, touch recomposition and graded black handoff into the existing page. Only Hero styles were edited by the implementer.

## Decisions taken

Use a native composited video underneath an alpha WebGL surface: preserves original video fidelity and avoids video-frame texture uploads. Bound canvas resolution to DPR 1.75 and 2.4 million pixels while retaining the same material and interaction. Use a three-octave low-frequency roughness field with static fine grain; keep chromatic response restrained. Keep the source at the identity-oriented center-right when keyboard exploration begins. An opaque black readiness/error surface is honest unavailable handling, not a substitute approved visual effect.

## Verification evidence

| Check | Actual result |
|---|---|
| `npm run lint` — first implementation | Exit 0, no warnings/errors |
| `npm run build` — first implementation | Exit 0, 17 static pages; Hero compilation and TypeScript passed |
| `npm run verify:media` | Exit 0; all 6 originals and served copies match recorded SHA256 |
| Final lifecycle hardening: `npm run lint` | Exit 0, no warnings/errors |
| Final lifecycle hardening: `npm run build` | Exit 0; compiled in 4.0s, TypeScript in 3.1s, 17 static pages generated |
| Final lifecycle hardening: `npm run typecheck` | Exit 0, strict TypeScript |
| Browser playback, reveal, input and recovery | Parent verification pending; no browser/server started by implementer |
| Source scope | Only `src/features/hero/**` and this report written by implementer; parent owns independent routing/card-shell updates |

## Browser acceptance checklist for the parent

Inspect `data-hero-status`, `data-visual`, and `data-light-active` on the Hero root. Before pointer entry, native `currentTime` must increase while `paused=false`; readiness must be `ready` with the film fully concealed. Reveal while time continues, then leave and confirm concealment without a time reset. Compare two successive frames while holding the light still. Check fast reversals, primary dragging beyond the section, keyboard movement and Escape, mobile horizontal drag and native vertical scroll, resizing/orientation and DPR, offscreen/visibility return, route away/back, and WebGL loss/restoration. Force an MP4 failure or blocked autoplay and verify the opaque material and honest status. Check the light at the supplied film’s brightest frames for text legibility. A static screenshot cannot verify moving media or input continuity.

## Limits

Compilation verifies source compatibility, not rendered light quality or sustained frame rate. Real Safari/iOS/Android certification, measured GPU performance, browser fault injection, and independent cross-family review have not been performed by the implementer. The supervisor’s verification is not labeled independent cross-family review. No publication, new dependency, backend work, asset modification or M3 interaction is included. Visual acceptance belongs to Sadegh.

RULES DELTA: NO DELTA.


## Parent browser verification — 2026-10-03

Verified in the connected Chromium in-app browser against the production build:
- On returning from About to Home without entering the light control: status ready, visual ready, light inactive, native video paused=false and currentTime advancing; the surface remained visually concealed.
- Keyboard Home/ArrowRight activates the local reveal; Escape sets light inactive while the film continues playing. Rendered moving film was visible through the illuminated area in desktop and 390px mobile-layout captures.
- Route exit/return and offscreen-to-onscreen resume were exercised. Initial offscreen loading/paused state recovered when the section entered view.
- 390px and 1440px layouts have no horizontal document overflow; all five portrait shells fit their grid. A 1440px aspect-ratio sizing overlap was detected and fixed with explicit width:100%; final card bounds were 243px wide x 400px tall, separated by 16px gaps.
- Browser warning/error log was empty. All 18 HTTP route checks, 11 internal homepage destinations, robots/sitemap and native MP4 range delivery passed. Unregistered details/admin respond 404. Production server log was clean after the rewrite host fix.
- Final build after the parent portrait sizing fix passed (17 static pages).

Not certified: real touch hardware, Safari/iOS, reduced-motion emulation, blocked-autoplay/media-error injection, GPU context loss injection, or measured sustained frame performance. No independent cross-family review is claimed. Owner visual approval is still pending; M3 interactive service cards have not started.
