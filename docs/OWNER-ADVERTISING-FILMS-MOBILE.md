# Advertising films and mobile playback — 2026-10-14

Implemented locally in E:/MOSAIX_AI/Projects/MOSAIX-AI Website.

## Result

- Advertising service now presents ARA, NOVA, APEX, AETERNA, TITENIESTER and APAX ONE PREMIUM in that order. The supplied English descriptions are preserved; the complete new section and controls also have Arabic copy.
- Glass panels share the website portfolio design. Desktop films alternate physically left/right; phones stack each portrait film above its copy. The original main service-card size, shape and ring motion are preserved.
- All advertising films autoplay muted while visible, retain their original 9:16 picture and audio, and have a top-corner sound control. Only one film may be audible. Offscreen films pause; the user can also pause explicitly.
- Clicking/tapping the film opens standard fullscreen where supported. iPhone native video fullscreen is feature-detected as a fallback; exiting restores inline playback. Unsupported browser environments show an accessible message. Sound and pause controls remain separate from the fullscreen surface.
- Existing website previews and the active homepage service card autoplay on phones while visible. Desktop hover behavior remains. Mobile Hero shows its native autoplay film directly without the opaque light mask or WebGL draw loop. Desktop light exploration is retained.
- Carousel touch handling now owns horizontal drags in either direction, suppresses a swipe's accidental link click, preserves vertical page gestures and pinch zoom, and loops without navigating away. Native OS browser-edge gestures cannot be guaranteed on every physical handset.
- Advertising text, media, visibility and ordering are editable in the existing owner workspace. Existing saved content overrides merge with the new defaults. Published films require complete text/media, safe media URLs and unique slugs; private drafts are filtered from public CMS content.

## Media mapping

| Supplied file | Published film |
| --- | --- |
| Door Reomte.mp4 | ARA |
| AI Home Robot.mp4 | AETERNA |
| Ai Headset.mp4 | APEX |
| Security robot.mp4 | NOVA |
| Sound Speaker.mp4 | TITENIESTER |
| Desktop Case.mp4 | APAX ONE PREMIUM |

Source folder: E:/MOSAIX_AI/Projects/MOSAIX-AI Website/Videos/Advertising Videos.
Served films/posters: E:/MOSAIX_AI/Projects/MOSAIX-AI Website/public/advertising.
Remuxed H.264/AAC with fast-start; no picture/audio re-encoding. All six original/served stream payload hashes match. Posters use product-reveal frames (6.5s; security film 8.3s).

Owner identity correction after the initial milestone: NOVA now uses `/advertising/aeterna.mp4` and matching JPG; AETERNA uses `/advertising/nova.mp4` and matching JPG. Asset filenames retain their initial names to avoid unnecessary duplicated media. Product names, descriptions and ordering remain unchanged. Earlier mapping evidence is historical; see the final-quality film matrix for the corrected assignments.

## Verification

- 35 distinct existing/new tests passed across registries, assistant policy, CMS/authentication, OpenAI contract, motion geometry, SEO and i18n. Full lint plus targeted lint on subsequent refinements, the final production build and TypeScript passed.
- Chromium and WebKit: 8 contexts at 1440x1000, 390x844, 320x740 Arabic and 844x390. All 48 film cases passed autoplay, decoded progress, sound, explicit pause, aspect ratio, alternating/stacked arrangement and fullscreen or supported fallback UI. No page errors or horizontal overflow.
- Six mobile capability fixtures exercised the iPhone-prefixed fullscreen entry/exit contract. This is simulated API coverage, not physical iPhone testing. Native standard fullscreen also passed in supported engine contexts.
- Both engines passed mobile native Hero, all four mobile website autoplay previews and simulated pagehide/pageshow return while preserving explicit pause. Desktop hover still passed.
- Five forward and five reverse carousel gestures looped in every mobile context. Chromium used native touch input; Windows WebKit used synthetic touch events because its Touch constructor is unavailable. The initial WebKit fixture failure was a harness error and was corrected before the complete matrix passed.
- Visual inspection exposed Arabic pause/fullscreen overlap at 320px. Controls now occupy separate physical corners with bounded text width. Final narrow control check: Chromium and WebKit 320px Arabic, all 12 film cases and control-bound separation passed. Final screenshots inspected.
- Native vertical page-scroll regression check: Chromium 390x844 and 844x390 passed real touch scrolling; page advanced 197px/187px and the selected card did not change.
- Final rebuilt-source smoke: Chromium/WebKit at 390px English and 320px Arabic passed native Hero, accurate screen-reader autoplay guidance, decoded film playback and separated controls, with zero page errors.
- Release scanner found no credential patterns, no individual file over 100 MiB and no private runtime directories. Local API/cloud storage keys remain unset; no new API/live-model validation is claimed.

Evidence: E:/MOSAIX_AI/Projects/MOSAIX-AI Website/docs/evidence/advertising-mobile-2026-10-14.

## Publication status

Local base main tracks origin/main at 701164b, with origin pointing to the owner's MOSAIX_AI repository. This milestone has NOT been pushed or deployed. A fresh attempt to open the repository was rejected by browser security with a saved permission Block and an explicit prohibition on alternate-tool workarounds. No Git CLI/API/plugin upload or Vercel deployment is used to bypass that restriction. Repository/deployment privacy and new live behavior are not verified. Owner-provided existing URL: https://mosaix-ai-tau.vercel.app/ .

No purchases, public-access changes, model-setting change, automation resume or PC shutdown performed.
