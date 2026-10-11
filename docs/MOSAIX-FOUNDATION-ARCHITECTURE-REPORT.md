# MOSAIX FOUNDATION ARCHITECTURE REPORT

Date: 2026-10-03. Milestone: M0. Status: INSPECTION VERIFIED / ARCHITECTURE PROPOSED / OWNER APPROVAL REQUIRED.

## 1. Executive decision

Recommend Next.js App Router + strict TypeScript + CSS design tokens/modules, with server-rendered semantic content and narrowly scoped client interaction components. Hero uses a custom WebGL concealment-material shader over a continuously playing native video. Service Cards use native videos behind animated glass/transmission layers. The persistent site background uses a few composited CSS layers rather than a full-screen WebGL scene. No website code, deployment, backend or visual acceptance is claimed in M0.

Approval covers M1 foundation, the M2 Hero technique, and the M3 card/touch/media architecture described here. M2 and M3 each retain their own visual approval gates. Backend provider/account choices are deferred until M6; Assistant provider until M7.

## 2. Resolved authority and rules

| Source | Resolution |
|---|---|
| TANIA-MOSAIX-HANDS-OFF-REMOTE-DIRECTIVE-v1.1.md | Current user-supplied operating directive; highest project authority after current user instructions |
| Projects prompts/MOSAIX-AI Website/MOSAIX_Master_Prompt_v1.docx | Only discovered project Master Prompt; document header v1.0; supplied as canonical specification. No separate approval marker found |
| Cores/PROMPT-RULES-v3.4-PRODUCTION-FINAL.md | Active production Core v3.4, dated 2026-09-18 |
| Cores/00-CORE-v2.md | Content header v2.1; inspected for resolution, superseded for this project by production v3.4 |
| LLMs/01-ASTRA-6-RESOLVED.md | Architecture routing reference inspected; not a claim that the current session runs Astra |
| Skills/mosaix-rules-runtime-compiler-v1.0.0/mosaix-rules-runtime-compiler/SKILL.md | Resolution skill v1.0.0; subordinate to explicit user precedence |
| Skills/mosaix-scroll-video-hero-v1.0.0/mosaix-scroll-video-hero/SKILL.md | Inspected and rejected as inapplicable: scroll scrubbing conflicts with the autoplay/light-reveal Hero |
| Debug and after | NOT LOADED; explicitly user-gated |

Directive precedence wins over the compiler skill's conflicting Core-first precedence and the Core's automatic release-runbook instruction. Heavy runbooks require explicit owner instruction. Legacy rules remain untouched. No model or reasoning effort was switched. No model overlay is marked approved for the next milestone yet.

Intended complete product: CLASS 3 because of project requests, admin and chat/user data. Current M0: documentation only. MODE C: G1 yes / G2 yes / G3 yes / G4 yes / G5 yes; proposals below are not frozen until approval. No applicable AGENTS.md was discovered in the project tree or checked parent directories.

## 3. Filesystem and repository evidence

Canonical workspace: E:/MOSAIX_AI/Projects/MOSAIX-AI Website. Initially contains Videos/ with six MP4 files. No package.json, source code, lockfile, environment files, deployment configuration or .git present. git rev-parse reports: fatal: not a git repository (or any of the parent directories): .git. No remote or public deployment is established. Do not infer a repository or domain from other MOSAIX projects.

Available commands: Node v24.7.0, Git 2.55.0.windows.4, Python 3.14.0. ffprobe was not found on PATH. PowerShell sandbox blocked ZIP/XML method calls; approved elevated read extracted the full DOCX text. Shell network access is restricted; dependency access is not verified. M1 must verify supported runtime/package versions before installation and pin a lockfile.

Master Prompt SHA256: 199B08B58F0CE64D0E5AE6A01E28F1ADB71ACFE4970A24D1878FB200535E36F5.

## 4. Media inventory and mapping

Metadata derived read-only from ISO BMFF mvhd/tkhd/stsd boxes; hashes computed from complete bytes. This verifies file identity and container metadata, not decode quality or visual framing. All assets are MP4, 1280 x 720, 16:9, sample entries avc1 (H.264) and mp4a (audio track; detailed audio profile not probed).

| Role | Existing project-local filename | Bytes | Container duration, seconds |
|---|---|---:|---:|
| Hero | hero section.mp4 | 4832817 | 10.005 |
| Website Design & Development | Website design.mp4 | 4623647 | 8.000 |
| Application Design & Development | App design.mp4 | 5926929 | 10.005 |
| AI Automation Design & Development | Ai automation.mp4 | 5671143 | 10.005 |
| Advertising & Custom Video Design & Production | Advertisment video.mp4 | 5792139 | 10.005 |
| AI Tools — MOSAIX LAB | Mosaix Lab video.mp4 | 4728859 | 10.005 |

Each project-local file matches its central-library counterpart by SHA256. Ai barber.MP4 exists only in the central library (2095441 bytes, 10.006 seconds, same dimensions/sample entries); it is an unassigned portfolio candidate, not evidence of a public project or approved case study.

MUST retain originals without rename/move/recompression/deletion. M1 media serving uses byte-identical build copies with explicit mapping and hash verification; existing filenames can remain URL-encoded. Re-encoding, posters extracted from approved films, and crop/focal decisions require the applicable asset/creative approval. FPS, GOP interval, color profile, actual decoded frames and visual focal points remain NOT VERIFIED. No founder photos, approved logo files or licensed font files were found in this project's initial contents.

## 5. Foundation and directory architecture

Proposed single-project layout: src/app for routes, src/components for semantic shell, src/features/hero, services, projects, requests, assistant and admin for bounded systems; src/content for registries; src/lib for server adapters, validation and motion/media lifecycle; src/styles for tokens; public/media for verified build copies; tests for behavior; docs for evidence and decisions; AI Rules for pinned task/rules records. M0 creates only documentation directories.

Public content defaults to Server Components. Client islands own pointer input, shader, card transmission and navigation state. No high-frequency React state updates. CSS Modules and global tokens define chromatic black, deep navy, white, restrained blue and chrome accents. Typography composition, licensed font choice and actual logo/signature geometry are resolved in M1 without invented brand assets. GSAP owns section narrative transitions; an explicit RAF renderer owns Hero light state. No Lenis/custom scroll engine initially; native scrolling remains authoritative.

Package versions: verify stable supported versions in M1, install exact versions and retain npm lockfile. Planned validation: TypeScript, lint, production build; Vitest for registries/validation; Playwright for route, interaction and cleanup behavior. Unit tests must not mirror trivial implementation details.

## 6. Routes and registries

| Route | Purpose / milestone |
|---|---|
| / | Cinematic home; M1 semantic foundation, M2/M3 priority visuals |
| /services | Five-service index |
| /services/website-design-development | Website World; M4 |
| /services/application-design-development | Application World; M4 |
| /services/ai-automation | Automation World; M4 |
| /services/advertising-video | Advertising World; M4 |
| /services/mosaix-lab | AI Tools service entry connected to /lab; M4 |
| /projects | Dedicated curated portfolio composition; M5 |
| /projects/[slug] | Internal case study; M5 |
| /start-a-project?service=[id] | Contextual request; M6 |
| /book-a-meeting | Separate appointment flow; M6 only after provider configured |
| /about | Approved founders and credible copy; M8 |
| /lab and /lab/[slug] | Actual experiments only; M8 |
| /admin/* | Private operational interface; M6 |

Service registry: id, slug, exact title, approved proposition/capabilities/process, mediaId, relatedProjectIds, CTA context. Media registry: id, source filename/path, served URL, bytes, dimensions, duration, codec entries, hash, approved focal position. Project registry: id, slug, title, serviceIds, availability enum, approved preview media, case-study content, verified external link and verification record, publication state. Lab registry is distinct from client portfolio.

Project availability is discriminated: LIVE PROJECT requires verified public live URL; INTERACTIVE DEMO requires verified demo URL; CASE STUDY ONLY has no external CTA; DOWNLOADABLE APP requires verified artifact link. A GitHub URL cannot satisfy live availability. Build validation rejects broken relationship IDs and invalid published records. No seeded fake projects or invented outcomes. Spatial portfolio design is reserved for M5 and cannot default to a grid/carousel.

## 7. Hero: two viable approaches and recommendation

### A — Native video + custom WebGL concealment/material overlay (recommended)

A native muted, inline, looped video continuously plays below an overlay canvas. The canvas draws chromatic-black material with alpha coverage controlled by an analytic light field. Shader hierarchy: compact luminous core, asymmetric illuminated body, broad weak spill, soft penumbra with low-amplitude coherent variation, restrained blue edge/specular response. Concealment coverage decreases only within illumination. Temporal variation must be restrained and deterministic; no obvious animated noise. Text and CTAs are above this as real HTML.

Sample a video texture only if local luminance/refraction is needed for the accepted material; the first rendering pass uses the independently composited native video to avoid unnecessary per-frame texture uploads. If texture sampling is introduced, upload on new decoded frames through requestVideoFrameCallback, with a supported fallback. Draw rate and decoded-video update rate remain separate. Shader blend/premultiplied-alpha behavior requires testing to avoid edge halos.

Strength: controllable organic penumbra, rich material response and continuous video; custom shader is confined to Hero. Risk: alpha compositing, GPU/context loss, Safari/high-DPI performance and video layering require actual device verification. No performance success is claimed before M2.

### B — Native video + procedural Canvas concealment mask

A Canvas 2D surface composites a generated light-field mask into a chromatic-black cover with destination-out. Use layered soft fields, asymmetric profiles and coherent low-resolution material variation rather than a single circle. Native video remains independently playing and typography remains HTML. CSS mask-image is available for a precomputed-mask variant, but dynamic mask updates need separate cost measurement.

Strength: simpler rendering pipeline without shader/context dependency; preserves the same conceptual layer order. Risk: dynamic canvas/mask rasterization and upload cost, blur cost, and harder convincing refraction/specular control. It must independently pass the same aesthetic tests. Neither a radial CSS cursor nor global opacity fade is acceptable.

Recommendation: approve A for M2. Build the reveal field as renderer-independent inputs so B remains a testable alternative. A failed GPU or mobile test is evidence for a decision gate, not permission to switch visible behavior silently. Material simplification and any visually different fallback need Sadegh approval.

### Input, playback and choreography contract

Light state: target position -> time-based damped position/velocity -> shader uniforms. Desktop pointer explores the surface; primary-button dragging remains supported; no right-click dependency. Video readiness/play starts independently before the first reveal. An almost-dark initial surface contains a subtle semantic exploration cue. No cursor lamp sticker, hard circular boundary or excessive bloom.

Touch proposal for approval: horizontal drag explores light inside the Hero with touch-action: pan-y; native vertical scroll remains usable. A semantic exploration control provides keyboard arrow movement and a clear escape/exit. Mobile ambient reveal cue teaches the interaction without exposing the whole film. This is a proposed adaptation, not an already approved behavior.

Scroll leaves through composed typography/light/background handoff, without scrubbing video time. Hidden tabs stop decorative rendering. Hero video remains playing while the ready Hero is actively displayed, regardless of illumination; offscreen/hidden-document lifecycle is explicitly distinct from pointer events. Route exit cancels RAF, observers, events and video-frame callbacks; route return prepares video readiness before illumination. Autoplay rejection must surface an honest media-unavailable state; no false playback claim.

## 8. Service Card material and lifecycle

One family of five glass cards, exact service titles, meaningful HTML CTA. Default material fully conceals video; no poster, image or thumbnail visible. Hover/focus changes optical transmission, reflection and subtle depth, revealing the mapped film. Separate legible text scrim prevents contrast loss. Leave transitions back to opaque glass before decoder release. Video bounds remain clipped to card radius.

Lifecycle: dormant -> nearby metadata/source readiness -> decoded first-frame ready -> active playback/transmission -> conceal -> pause -> release when distant. Do not allow a transition to reveal unready media. Nearby cards prepare enough media to avoid first-hover stalls without decoding all films continuously. Active media pool proposal: Hero plus one active service film; transitions must be checked for stutter, and a wider pool needs measured justification. Catch play rejection and keep the glass state honest. Do not flash a poster while waiting.

Touch proposal for approval: dedicated preview button toggles film reveal; a separate semantic service link navigates in one tap. Avoid ambiguous double-tap-to-navigate. Keyboard focus and preview control expose equivalent content, Escape closes preview. Desktop card link navigates directly and nested controls must not produce invalid interactive HTML. Transmission reverses from its current state under rapid pointer enter/leave.

## 9. Global background and motion ownership

Persistent shell owns two or three low-amplitude black/navy light layers with slow transform/opacity drift and restrained blue breathing. Service context affects existing field parameters; it does not spawn independent worlds of unrelated effects. Optional fine grain is static and lightweight. No fullscreen GPU/particle simulation or floating blobs.

Motion ownership: CSS owns ambient layers and short card material transitions; Hero RAF owns inertial light/rendering; GSAP owns section-level choreography only. A shared motion policy coordinates visibility and reduced motion. Each component owns cleanup and does not create competing scroll controllers. Reduced motion removes ambient drift/inertial flourish, keeps composed dark surface and direct user-operated reveal; video-motion handling is explicitly approved in M2, with an accessible pause option if required.

## 10. Responsive, accessibility and semantic SEO

Recompose for mobile, tablet and desktop, with cached measurements updated on resize/orientation. Cover fitting must not silently crop the signature focal content; inspect decoded footage before freezing focal points. Native scrolling, accessible touch controls and keyboard focus are acceptance requirements.

Real HTML carries headings, explanatory copy, service/project links and CTAs. Decorative canvas is aria-hidden. Maintain contrast through both dark and revealed video states. No information depends exclusively on hover. Verify keyboard order, accessible names, reduced motion and zoom.

Use server-generated per-route metadata/Open Graph, approved-domain canonical URLs, sitemap and robots. Do not invent the domain. Preview deployments are excluded from indexing; production serves legitimate crawlers and only approved published records. Structured data includes only facts from approved content; no fabricated reviews/prices. Unknown routes return actual 404s. Admin is access-controlled and excluded from public SEO.

## 11. Portfolio, backend/admin and assistant boundaries

Portfolio uses approved Preview -> Case Study -> verified Live/Demo/Download relationships. The Ai barber video alone does not establish project title, scope, ownership, metrics, technology or URL. Validate these before publishing. Founders names/roles can come from Master Prompt, but no biography claims or fabricated portraits.

Recommended M6 direction: server-only request/appointment handlers, managed relational PostgreSQL, validated shared schemas and simple authenticated admin. Database, managed identity/account provider, email destination, retention and appointment availability source require concrete owner/account selection before dependent work. Initial admin role: invited owner/editor with server-enforced permissions, no public signup. Exact auth contract is deferred, not implemented.

Request success means durable validated record creation; email notification is separately queued/observed, and failures remain visible to operators. No fake success response. Upload feature is deferred until allowed types/limits, private storage, access, scanning/rejection and retention are frozen. No payments or public fixed prices in this scope. Client receives only safe errors, never credentials or private filesystem paths. Unauthorized access and invalid requests must be rejected in M6 acceptance.

Assistant M7: server-side configurable provider adapter, approved knowledge source with revision IDs, grounded answers and service/project/request routing. Unknown prices/timelines/project facts remain unknown. No browser secrets, autonomous external actions or unrestricted invented claims. Provider, consent, conversation persistence and retention are owner/account decisions for M7.

## 12. Deployment architecture

Recommend a Next.js-compatible managed Node deployment and CDN media delivery, initially via an isolated private preview. Keep provider-specific adapters out of public feature code. Production publication requires explicit owner approval and real account/domain configuration. No hosting account, domain or remote repository is verified in M0. Git initialization can occur in M1; remote creation/push is separate authorized work. Media server must support correct MIME/cache behavior and seek/range delivery. Private uploaded files must not share public asset storage. Heavy release runbooks remain explicitly user-gated.

## 13. Risks and proposed budgets (not measurements)

| Risk | Verification / mitigation |
|---|---|
| 720p films become soft on large displays | Inspect actual decoded hero at desktop cover sizes; changing source/recompression requires approval |
| Audible audio tracks | Set muted/defaultMuted/playsInline before any play attempt; verify no audio |
| Safari/autoplay/video compositing | Real Safari/iOS required; Playwright WebKit is additional evidence, not device certification |
| High-DPI fill rate | Proposed render DPR cap 1.5 desktop, 1.25 mobile; visual effect must be accepted before cap frozen |
| First card hover hitch | Prewarm nearby film; instrument readiness and reveal; never reveal a stale/unready frame |
| Context loss / route leaks | Simulate context loss, route-return cycles, observer/RAF teardown |
| Touch exploration conflicts with scroll | Test proposed pan-y and separate preview/navigation controls on device |
| Backend and domain unavailable | Explicit integration boundaries; do not fabricate delivery or live URLs |
| Missing brand/portfolio assets | Use approved text-only foundation; defer unsupported facts/imagery |

Proposed M2 measurement target: 60 Hz devices sustain p95 rendered frame intervals <= 20 ms during a 30-second interaction on named test hardware. Track long tasks, dropped decoded frames and route-return retained resources. This is a target, not a benchmark. No silent effect removal to meet it. Proposed core-web-vitals production goals: LCP <= 2.5 s, INP <= 200 ms, CLS <= 0.1; confirm measurement methodology in implementation and report actual environment/results.

## 14. Exact milestone acceptance

M0: canonical prompt fully extracted; active rules/conflicts recorded; project state and all six media mapped; matching source hashes verified; two Hero approaches compared; ownership/lifecycle/routes/backend/deployment boundaries recorded; no full implementation before approval. Evidence: DOCX ZIP/XML extraction, rg inventory, git rev-parse and MP4 container/hash parser.

M1: production build/typecheck/lint succeed; semantic routes/404 behave correctly; registry references validate; responsive shell has no horizontal overflow at 360, 390, 768, 1280 and 1440 px; no invented published project or live URL; assets remain byte-identical; real app console has no owned errors.

M2: reveal recording shows video moving before first pointer input and across pointer leave/return without restarting; simultaneous illuminated and dark regions show local reveal; light core/body/spill and organic penumbra pass Sadegh visual review; no hard circle/global fade; fast reversals and drag show no stepping; no audio/controls/loading flash; typography stays readable; resize, orientation, tab return, context loss and route return tested; touch/keyboard/scroll behavior and reduced motion verified; actual named-device performance report attached. Visual approval cannot be inferred from compilation.

M3: each default card screenshot has no visible film/thumbnail; hover/focus reveals correct mapped video through glass; text contrast/clipping hold at all transition points; rapid enter/leave reverses smoothly; cold first-hover and warm hover recordings show no flash/hitch; leave restores clean glass; links navigate correctly; touch preview and direct navigation verified; only allowed active decoder lifecycle persists after scroll/route changes; Sadegh accepts unified material quality.

M4-M9: each scope receives bounded acceptance before work. Business flows require real configured destination and negative-path validation/auth checks. Assistant requires grounded unknown-answer tests. Integration checks do not silently redesign approved visuals.

## 15. Owner decision and next milestone

Recommended approval: Next.js semantic foundation; Hero A with renderer-independent field contract; unified native-video Service Cards with prewarm/conceal lifecycle; touch exploration pan-y plus explicit card preview button; lightweight living background. Alternate Hero B stays a tested alternative and requires approval if its visible result differs.

Next action after approval: M1 only, then M2 Hero only, then M3 cards only, preserving visual gates. Recommend current approved Sol-class implementation model with High effort for bounded multi-file M1; reserve Astra-class High for M2 compositing judgment and difficult cross-system issues. These are recommendations from project routing rules, not price/availability claims. No silent model/effort switch; current session model identity/effort is not assumed from an overlay filename.

## 16. Sources and limits

Read on 2026-10-03:
- Next.js server/client boundaries: https://nextjs.org/docs/app/getting-started/server-and-client-components
- MDN video textures: https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/By_example/Video_textures
- MDN decoded-frame callback: https://developer.mozilla.org/en-US/docs/Web/API/HTMLVideoElement/requestVideoFrameCallback
- MDN CSS masks: https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/mask-image

These establish APIs/capabilities, not guaranteed aesthetics or performance. Technical rendering choices and proposed budgets are engineering recommendations. No footage playback, mobile/browser prototype, build, external repository, deployment, backend or AI delivery has been verified in M0.

RULES DELTA: NO DELTA. User directive overrides conflicting central-library precedence/release routing; originals are not edited.
