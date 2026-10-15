# MOSAIX complete-media loading — 2026-10-15

The owner's latest instruction prioritizes a complete presentation even when visitors must wait longer. This supersedes the earlier first-view-only buffering strategy.

## Delivered behavior
- Before entry, all 16 published bundled films are downloaded completely in the device-appropriate version. A shared queue limits transport to two simultaneous requests.
- A film source is exposed to native players only after the full response is received. Truncated responses, invalid response types, and mismatched content hashes cannot become playable. Complete verified responses are stored in browser Cache Storage. A media-only service worker serves full responses and exact byte ranges during navigation, preview, fullscreen and replay; document and authentication requests are never cached.
- The welcome screen also waits for required brand/founder/poster images, fonts, and an actually playing first frame of the first view. The film starts behind the opaque loading screen after all files are ready. Browsers that deny autoplay expose a play button while the loading screen still covers the page. Real preparation progress is shown.
- There is no timer-based entry and no bypass to an incomplete website. A failed download shows retry. The slow-connection message asks the visitor to keep the page open. An idle connection times out after 60 seconds without incoming data; downloads retry automatically up to three attempts before showing manual retry.
- Service transitions reveal their destination after a real video frame is presented. A browser autoplay restriction exposes an explicit play control; elapsed time alone cannot reveal an unready film.
- The delivery variant is fixed for the document, avoiding new film downloads on viewport changes. Phones and Save-Data visitors choose the smaller version.
- Nearby players may prepare their local decoder through a shared queue. They receive complete local files; playback controllers still own pause, sound, visibility and native fullscreen.
- Hashed delivery assets have immutable caching and byte-range support. Originals remain available unchanged. Brand/founder images use responsive optimization.

## Measured media bytes
| Delivery | Total bytes for the same 16 films | Reduction |
|---|---:|---:|
| Original files | 64,511,222 | — |
| Desktop copies | 32,501,754 | 49.62% |
| Mobile copies | 16,300,239 | 74.73% |

The homepage film alone changes from 4,832,817 bytes to 2,438,724 on desktop or 1,062,256 on mobile. These are actual sizes, not a promise of equivalent loading-time improvements. The deliberate tradeoff is longer initial preparation, followed by playback that does not depend on continuing video downloads.

All 32 MP4s retain duration/aspect and fast-start metadata. Advertising copies retain AAC audio; backgrounds/previews omit unused audio. Sampled SSIM minimum is 0.9684 (three seconds from 0.5 seconds, reference resized to delivery resolution). This is sampled quality evidence, not a lossless or whole-film claim. The six original media files and served originals retain their SHA256 hashes.

## Verification
Production build, TypeScript, lint and all 46 unit/contract tests passed, including partial responses, corrupted complete-length responses, retry, concurrency limits, all-film selection and exact cached byte-range responses.

The final browser evidence directory records:
- 17 strict entry/network cases in Chromium and WebKit, including delayed files on another page, no bypass on a slow connection, failed-request retry, correct mobile downloads, complete-file reuse after further media requests are denied, no-JavaScript content access and reduced motion.
- 48 advertising-film cases across desktop, phone, narrow Arabic and landscape, checking responsive sources, original film/poster assignment, sound, manual pause, fullscreen and offscreen pause.
- Portfolio return/re-entry checks and separate native-player ownership/control checks.

Native iPhone-player contract fixtures and desktop WebKit are not physical-handset testing. Chromium and a separate Firefox test verified cached playback/80%-duration seeking with origin video responses denied. Windows WebKit's platform-native loader bypasses service workers and rejects Blob media: its coverage verifies complete-download gating and online presentation, not offline native delivery. A physical Safari/iPhone cache-delivery claim is not made. Local cached timings are not public Core Web Vitals. The media cache stores about 16.3 MB of video payload on mobile or 32.5 MB on desktop for the current selection, plus temporary download and decoder memory. The page verifies cached hashed films again before use; valid entries are reused without rewriting them.

Evidence: [loading-performance-2026-10-15](evidence/loading-performance-2026-10-15/).

## Maintenance
Run npm run optimize:media with FFMPEG pointing to an installed FFmpeg binary after replacing bundled source films, verify media delivery, then commit the generated manifest and hashed outputs together. Owner Blob uploads retain their approved URLs as transport sources and are fully prepared in the browser, but are not automatically transcoded by this local build script.

No credentials, storage accounts, content overrides, domain/indexing policy or deployment-protection settings changed. The existing GitHub-to-Vercel integration publishes main after the verified release is pushed.

The media-cache/Range approach follows the [Chrome team's cached-media guidance](https://developer.chrome.com/docs/workbox/serving-cached-audio-and-video) and the service-worker workaround described in [WebKit's Blob playback issue](https://bugs.webkit.org/show_bug.cgi?id=232076). No external Workbox library or third-party runtime is loaded.
