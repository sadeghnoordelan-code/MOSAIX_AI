# Final local quality review — completed 2026-10-15

The owner-corrected NOVA and AETERNA films and posters are now swapped together. Names, descriptions and product order stay as requested. NOVA uses the original Security robot.mp4 payload; AETERNA uses AI Home Robot.mp4. Initial served asset filenames are retained; the current rendered source paths are verified in the film matrix. No video/audio recompression occurred in this correction.

## Actual defects corrected

- The assistant introduction bubble covered advertising controls on narrow phones. It now yields when it overlaps visible actionable content, returning away from controls; the assistant orb stays available.
- The orb's hit area covered the bottom-right fullscreen control on a short phone. Fullscreen is now upper-left, sound upper-right and pause lower-left. Portrait film proportions remain correct; available viewport height bounds previews in short landscape. Short-screen pause remains a labelled 44px control.
- Playback recovery overrode manual pause in the simulated native iPhone player. Native fullscreen now owns playback until inline return; native pause/play and sound choices synchronize, while page return resumes muted and explicit pause is preserved.
- Unsupported fullscreen feedback obscured the film indefinitely. It now clears automatically after 4.5 seconds; a browser regression waits for that removal.

## Verification and evidence

Evidence root: `docs/evidence/final-quality-2026-10-14/` (audit started October 14 and finished October 15, Tehran date).

| Check | Observed result |
| --- | --- |
| Ordered final-source sweep | TypeScript, lint, all 35 tests, production build, then generated TypeScript passed. Raw outputs: `after-fix/*-product-swap.txt`. |
| Route/layout/images/fonts | 216 cases across Chromium/Edge and WebKit, English/Arabic, 320px short portrait, 844px landscape, tablet, 1440px and 1920px. No horizontal overflow or page exceptions. |
| Additional Firefox coverage | 28 route cases, desktop/narrow viewport, both languages; six films play and sound/fullscreen or graceful fallback works. No final page exceptions. |
| Corrected advertising mapping | All 48 cases on the latest build passed decoded playback, exact rendered film/poster assignment, mute, pause, proportions, alternating/stacked arrangement and fullscreen/fallback. |
| Control/native-player regressions | 12 contexts in Edge, Chrome and WebKit; hit targets visible, uncovered and at least 43px measured, nominal 44px; manual pause, sound synchronization and return recovery passed. Native iPhone player events are fixtures. |
| Website portfolio return | 16 cases, each popup return, client home/card reentry and native history return; no refresh needed, manual pause preserved, offscreen preview pause. External destination documents are isolated fixtures, not a fresh audit of those live sites. |
| Autoplay failure recovery | Four AbortError/NotAllowedError cases in Chromium/WebKit passed; denial does not cause an infinite retry loop; explicit retry works. |
| Mobile input | Native Chromium five-card loops in both directions in both languages passed without accidental navigation; two portrait/landscape vertical gestures scroll the document without changing cards. Chat fits a keyboard-sized resized viewport. |
| Owner panel | Actual local sign-in/read/sign-out passed in four Chromium/WebKit desktop/320px contexts. All six film editors visible, no overflow, save disabled without edits, content/revision unchanged, logged-out API returns 401. Separate real HTTP auth/CSRF/origin/cookie checks passed. |
| Headers/SEO | 16 route checks, unique CSP nonce and blocked injected script passed. No purchased domain: intentional noindex, empty sitemap, no approved canonical. |
| Release files/secrets | No credential patterns, private runtime directories or files over 100MiB in the candidate release set. Exact configured private values absent from candidate text files and emitted browser assets. Values are never printed. |
| Production advisories | `npm audit --omit=dev --json`: zero known production vulnerabilities at check time. This is not a proof of complete security. |

The project has no separate `test:integration` command. Existing API/contract suites and real local browser regressions supply the integration coverage above; no missing command is represented as having run. Final lint includes all new audit scripts. The final production build includes the two-film correction; the broader route matrix preceded that data-only swap and the 48-film matrix and Firefox/editor/input checks followed it.

All emitted JS/CSS assets total **1,050,589 bytes raw / 320,772 bytes gzip**, across 24 files. This is not the initial route payload. No declared byte budget was found, so this is a baseline. Headless Chromium CPU4x carousel measurements: English median16.7ms/p9533.4ms, zero samples over50ms; Arabic median16.8ms/p9533.5ms, two samples over50ms. These are lab measurements, not physical-phone or field performance guarantees.

## Warnings retained and interpreted

- Twelve console 404 messages correspond to the intentional missing-page cases; the non-document failed-response list and page-exception list are empty.
- One earlier WebKit rapid hard-navigation run reported an access-control-like stream cancellation. Settled navigation and independent client-return tests passed. The cancellation attribution is an inference, retained in `webkit-replacement-investigation.json`.
- Earlier Firefox runs timed out waiting for network-idle on different service routes while the visible page rendered. Two isolated website repetitions played normally; the final full matrix passed with zero idle warnings. The initial timeout's cause is not proven. The final harness records any open media requests separately and still fails for pending non-media requests; it does not suppress page/playback errors.
- Next reports a missing metadataBase while no approved SITE_URL exists. The preview remains noindex. Configure the approved deployment origin before verifying production social URLs/indexing.
- Leftover scan is report-only: no production console logs/TODO markers/mock candidates; registry/test-support files and the legacy Noto Arabic dependency are static candidates. React DOM is a Next framework peer, not a safe deletion candidate. Intentional media/contact URLs and animation timings are listed, not blindly removed.

## Scope still unverified

No physical Android/iPhone hardware, real OS keyboard, live OpenAI response quality, Redis/Blob cloud persistence or newly deployed Vercel environment was tested. Local API/cloud keys are unset. There is one owner account and no public account registration/password-reset flow, so a two-public-account ownership scenario does not apply. No all-device or zero-defect guarantee is claimed.

No new push/deploy occurred. The earlier GitHub browser saved-permission denial explicitly prohibited alternate-tool workarounds; Git CLI/API/plugin upload or alternate-browser deployment was not used to bypass it. Repository/deployment privacy remains unverified. The local preview is `http://127.0.0.1:4180/services/advertising-video?lang=en`, background Node PID3408 bound to localhost. Heartbeat remains paused; no purchases, model-setting changes or shutdown.
