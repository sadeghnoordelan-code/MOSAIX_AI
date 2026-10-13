# Mobile QA and shared welcome orb — 2026-10-10

Latest owner instruction: replace the arrival object with the existing AI assistant orb at the lower right of the site. The welcome screen and assistant now use the exact same MosaixOrbVisual component, SVG filament paths and CSS animation system. Welcome scale is larger; brand identity remains native text/logo. The prior video/canvas chroma extraction loop is removed from the welcome screen. The preserved intro video setting is legacy and no longer drives this object.

Mobile verification: 13 routes x 10 viewports x 2 engines = 260 route-layout checks. Portrait widths 320/360/375/390/412/430/480; landscape 844x390 and 740x360; tablet 768x1024. Chromium via Edge and WebKit 26.5. No horizontal overflow, clipped main typography/forms, stretched videos, unexpected HTTP status or sub-16px form fields were found in the completed matrix. Ten chat window fit/composer checks per engine passed. Original matrix Chromium baseline included an incorrect test service URL, corrected to actual registered service slugs. Matrix screenshots were viewport-sized to avoid WebKit's 32767 pixel full-screenshot limit.

Improvements implemented:
- Explicit device-width viewport, initial scale 1, safe-area coverage; user zoom remains enabled.
- 44px carousel dot hit targets; mobile preview/action targets enlarged.
- Mobile menu works on coarse-pointer landscape widths up to 1000px and scrolls within short screens.
- Chat follows VisualViewport height/offset, with safe inset positioning and short-screen adjustments.
- Welcome composition fits landscape; world video fills dynamic viewport with object-fit cover.
- Mobile Hero shader DPR capped at 1.25, inactive-light GPU draws avoided.
- Hero does not render/play behind the welcome screen; finishing welcome resumes activity.
- If WebGL is unavailable, the decoded Hero video remains visible.

Final behavior test passed: actual simulated touch dot selection and swipe, one playing preview, offscreen pause, menu closure on navigation, composer/window fit in resized keyboard-like space, and Hero video fallback with WebGL disabled. CPU 4x throttle: median RAF interval 16.7ms, p95 33.3ms, no interval over 50ms during the sampled floor animation. This is a synthetic headless Chromium measurement, not proof for every handset/network.

WebKit matrix encountered access-control messages on RSC prefetches while the harness repeatedly abandoned documents. These are retained in webkit-final.json rather than silently filtered or called fully clean. A separate real client-navigation test with request-failure capture then opened About/Services/Lab/Start a project with zero page errors and zero failed requests. Shared welcome orb WebKit portrait and landscape composition checks passed; screenshots inspected. Chromium preview passed on the final running version after the earlier timeout; evidence is in behavior-final.json.

Evidence: docs/evidence/mobile-matrix/. Lint and production build/TypeScript passed. Local preview session 85498 at http://127.0.0.1:4180/. No physical Android/iPhone, real OS keyboard, Safari installation on iOS, actual notch hardware or constrained mobile network was tested. This is representative current-engine coverage, not a guarantee for every phone or older browser. No public deployment or OpenAI activation claimed.
Owner refinement 2026-10-10: floor light bundles now four, down from six. Removed legacy large intro-grain ellipse, softened welcome halo with radial gradient/blur and no shadow border. Final build/TypeScript and WebKit portrait/landscape/client-navigation checks passed; screenshot reviewed. Preview session46064.
