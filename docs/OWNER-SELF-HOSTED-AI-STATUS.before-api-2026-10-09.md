# MOSAIX implementation checkpoint — 2026-10-06

Status: implementation and actual-model acceptance testing in progress. The assistant is NOT approved or enabled as a finished product. No public deployment or external AI API.

## Owner scope

Continue the existing MOSAIX project, preserve the approved site experience, replace the rejected welcome sphere with the actual supplied reference motion, enlarge Your Next Possibility text, and build a real self-hosted bilingual strategic assistant. Latest correction: service-ring light strands must follow the visual/motion language of seconds 2–6 of the original Hero film. The owner requested GPT-6 Astra / High for ongoing development, hands-off continuation and only essential approval interruptions.

## Implemented

- Welcome sphere now composites a 360px crop of the actual owner video through a blue chroma matte. Original recording is preserved. Brand/logo/slogan stay native/separate. This is source-video motion, not the earlier shader approximation. Some blur comes from the supplied recording.
- CTA contacts and actions now use 17–22px and 18px text; heading remains large.
- Replaced dashed sine-wave electricity with coherent long cyan/white filaments, travelling light heads and sparse trailing particles. The paths curve on and above both floor rings; actual card changes accelerate them and the existing orb. This is a procedural spatial reconstruction of the Hero reference, not extracted pixels of its moving camera/metal sculpture. Offscreen/hidden/reduced-motion rendering is controlled.
- Dedicated /ai workspace with Persian/English, contextual entry links, real-stream client, input recovery/retry/stop, temporary session clearing, editable brief and explicit email draft handoff.
- Private llama.cpp adapter, server-only verified local knowledge, modular domain behavior, structured project state, bounded recent turns, request validation/size limits, same-origin checks, session/IP/daily limits, one active generation, timeout and no transcript logging.
- No hosted-model fallback, no external embeddings, no weights in browsers, no fake responses, no automatic email/CRM/booking/upload claims.

## Actual development hardware

Windows 10 Pro 10.0.19044; AMD Ryzen 7 3700U (4 cores / 8 threads); 5.88 GiB usable RAM, approximately 0.94–1.15 GiB free during inspection; integrated AMD Radeon RX Vega 10 (reported shared adapter allocation 2 GiB, not a claim of dedicated compute VRAM). This is development hardware, not an approved public inference server.

Runtime: official llama.cpp b11429 Windows x64 CPU distribution, SHA256 verified. Private 127.0.0.1:11435, bearer key outside Git, 1 slot, 2 inference threads, 3 batch threads, 8192 context, 128/64 batches; web UI, slot administration and MCP proxy disabled. Website activation remains separate from benchmarking.

Candidates being downloaded and verified: Qwen3.5-0.8B Q4_0 (563,036,064 bytes) and Qwen3-0.6B Q8_0 (639,446,688 bytes). These are hardware-fit candidates, NOT quality-approved choices. Partial files resume; do not delete them or download duplicates.

## Acceptance evidence so far

Production build, TypeScript, ESLint, 8 assistant unit tests, 5 registry tests and original-media hashes passed before the latest host-normalization fix. All 18 HTTP routes, 13 homepage links, 5 continuous-video service pages and official contact/process assertions passed. A new ninth AI test covers the real same-origin bug; final rebuild/retest is in progress.

Live desktop browser: actual welcome-video sphere rendered; three-card perspective and new flowing ring filaments visible; card side selection works; no console errors in that interaction; Persian RTL and failed-request message recovery/retry worked. The browser viewport override reports success but remains 1280×720 even after reload/new tab: do NOT claim mobile live verification. Responsive CSS exists; mobile verification remains pending. Browser testing revealed the same-origin bug, which has been fixed in source and is being rebuilt.

## Still required

Run both actual quantized models with identical MOSAIX benchmark prompts, review natural Persian/English, strategic disagreement, grounded contacts/pricing, no-image precision, injection, practical video advice and structured multi-turn continuity. Record first token, total latency, generation speed and real process memory. Minimum quality target is 4/5 with no hard hallucination/privacy/fake-action failure; warm first token target 10s, brief answer target 60s, full context pipeline 120s, concurrency 1. Do not activate a failing candidate.

After benchmarking: connect an accepted model only if it passes, verify real UI streaming/cancel/context/brief and API queue behavior, finish remaining responsive/accessibility checks. If neither passes, follow the owner's explicit quality gate with evidence and concrete hardware/self-hosted options. No paid purchase, no external API and no accepting a weaker experience without owner decision.

## Operational state

Canonical project: E:/MOSAIX_AI/Projects/MOSAIX-AI Website. Download/runtime assets: E:/MOSAIX-AI/.tools/local-ai. Read actual process/session status before starting another worker. Benchmark outputs are synthetic test conversations only in docs/evidence/local-ai-*.json. Private runtime key/log/state belong in ignored .local-ai. Local preview: http://127.0.0.1:4180.

A thread heartbeat named ادامهٔ تکمیل MOSAIX (id mosaix) exists every 30 minutes with successful-run notifications muted. Stop it when completion or a real owner decision is reached. Phone delivery is not verified. A same-thread follow-up requesting gpt-6-astra/high was accepted by the app tool; do not claim more model verification than the tool reports.


## Owner priority update — English first
The owner's latest direct instruction is to spend more time on English and leave Persian until the final stage. This supersedes the order of earlier bilingual acceptance milestones. Complete and evaluate the English experience first. Persian remains requested and pending, not removed. Baseline tests found serious failures even in English (including the second candidate claiming app development is free), so English grounding/strategy/context remain a real gate. A compact relevant-facts-only prompt and explicit response language are now being tested; historical baseline evidence must remain preserved.


## Latest checkpoint — 2026-10-07 (supersedes pending items above)

English-first comparison is complete for Qwen3.5 0.8B Q4_0 and Qwen3 0.6B Q8_0. Both still fail on actual English grounding/capability/strategy tests. See ENGLISH-MODEL-EVALUATION.md for measured timings and explicit evidence. Prompt-cache memory growth has been fixed with cache-ram=0 and no-cache-idle-slots. Key ACL setup now uses Windows icacls to avoid Set-Acl's unavailable security privilege. No key contents are logged.

The stronger Qwen3.5 2B Q4_K_M download was interrupted across sessions and resumed from the existing partial file. It is still downloading; do not start a duplicate download or infer acceptance. A sequential worker using scripts/benchmark-candidate.ps1 waits for the verified final model file, runs the English benchmark and stops only its own verified llama-server process afterward. It times out after three hours if the model file never arrives. Inspect actual processes/session status before restarting anything. Current download session: 26869; queued model benchmark session: 30433.

English response presentation now supports readable semantic lists, headings and code blocks with text-only rendering (no model HTML or executable links). Waiting/writing, stopped, busy, rate-limit and timeout messages are distinct. Retry repeats the appropriate failed operation. Ten assistant unit tests passed; lint passed; current production build is in progress (session 97512).

Live visual review confirmed the latest outer-ring refinement: coherent cyan strands travel around and above the rings. Earlier live checks confirmed same-origin clear/retry behavior, fixed service video during text scrolling, readable CTA contacts and aligned founder portraits. A 390px iframe showed the responsive layout, but full mobile touch/soft-keyboard/reduced-motion checks remain unverified because viewport control did not change the actual IAB viewport. Do not label those complete.

Next: inspect the queued 2B English evidence when available, then review real endpoint/UI streaming, context, interruption and brief handoff with any accepted candidate. Persian comes after English acceptance. If all hardware-fit candidates fail, prepare the concrete self-hosted hardware/hosting owner decision; no external fallback or weakened acceptance.


Final check for this work session: production build and TypeScript passed after repairing a text-block type-narrowing error. ESLint and 10 assistant tests passed. Production preview is running in session 33644 at 127.0.0.1:4180. Live desktop English checks confirmed starter fills the composer, failed offline requests retain the original user message, retry does not duplicate it, and Clear conversation resets the view and restores composer focus. The tab is marked as a deliverable. Successful model streaming/UI brief tests remain pending an accepted model; no fake response was used for visual proof. Download session 26869 and waiting benchmark session 30433 remain the only candidate workers. Read their actual status before launching replacements.


## Latest owner change — floating assistant and no prices

Owner explicitly requests an animated blue orb at the bottom of the existing site, an English welcome after a few minutes, and chat opened within the current page. This supersedes the dedicated /ai workspace direction. A global lazy-loaded native dialog and compact continuously rotating blue orb with two luminous filament paths are now implemented; the welcome is scheduled after 120 seconds of visible browsing and appears once per session. All navigation/contextual AI entry points now open the dialog. The legacy /ai route redirects home. Closing aborts active generation, preserves local chat/draft state and returns focus; native modal behavior handles background focus.

Owner pricing policy: no service prices, estimates, ranges, starting prices, packages, discounts or hypothetical workaround prices. Every pricing request must be referred to approved MOSAIX email/phone/WhatsApp. Updated verified policy and model instructions; an always-visible contact note is included in chat. Volunteered budget remains a planning constraint. English v3 benchmark includes direct-price, rough-range, budget-constraint and injection tests. These are genuine model tests, not proof that an unaccepted model follows the policy.

Earlier tool sessions were interrupted and no workers remained. Single resumed download then benchmark session is now 26546 (check live status before replacement). It resumes the ~932MB partial file, verifies SHA256, runs English v3 and cleans up its runtime. Build session 87512 is in progress. Eleven assistant tests passed. Pending live review of orb, timed welcome, in-page modal and updated mobile layout before calling this change complete.


## Live verification — 2026-10-08

The floating orb, continuous light strands and delayed English greeting were visually verified on desktop. Clicking the orb opened the dialog on the same URL. Today's production build passed including route-change/focus cleanup. A fresh IAB session now correctly honors the 390×844 viewport (the earlier viewport limitation is resolved). Verified mobile modal fits without horizontal overflow, controls remain readable, Escape closes it, page scroll stays at 422px, the orb regains focus, and the unsent draft survives reopening. Mobile-menu entry opens the same dialog and collapses the menu. A hidden-menu focus edge case was found and is being corrected; final recheck pending. Actual phone soft-keyboard behavior and successful accepted-model conversations remain unverified.

No local inference candidate is enabled. Previous workers were interrupted. Current single resumable download → SHA256 check → English v3 benchmark is session 82270. Current local production preview is session 60584. Inspect actual status before restarting; session identifiers are evidence from this run, not durable process identifiers. The 2B file was ~86% complete at last inspection; download speed is variable. Old completed English tests remain rejected, not production candidates.


Final floating-chat verification — 2026-10-08: the hidden mobile-menu focus fix passed live: after closing, Menu is collapsed and focus is on Open MOSAIX AI. The 390×844 and 390×500 views fit without horizontal overflow, and the composer/close controls remain visible at short height. Escape preserves the 422px page scroll position and unsent text survives close/reopen. Desktop viewport was restored. No browser console errors were recorded in these interactions. Latest build/TypeScript and ESLint passed; eleven assistant tests passed for this feature set. The final preview process is session 76473; the one remaining download/benchmark chain is session 82270. No duplicate worker is needed. Full inference/stream/brief acceptance remains pending; the website assistant is still disabled.

## Current continuation — 2026-10-09

The Qwen3.5 2B Q4_K_M file is complete and was SHA256-verified before rename. No download remains necessary. The earlier benchmark did not produce v3 evidence before interruption. After checking no project model/benchmark process remained, a single English v3 benchmark was restarted in session 87810 (runtime PID 7256). Inspect real processes before replacement. Website activation is still disabled.

Project brief now includes preferences, explicitly rejected options and contact preference, with user budget labelled as a constraint rather than a quote. The review panel makes its underlying conversation/toolbar inert and restores focus to the brief button. Twelve assistant tests passed for the brief change; TypeScript and ESLint passed after the focus change. Production rebuild still required after these latest changes. No public deployment.

The prior production preview is no longer running. The heartbeat automation was observed PAUSED; it was not resumed or modified during this continuation. English remains first and Persian last.

English v3 2B benchmark completed and is rejected: structured memory fabricated agreed phases and the full continuity pipeline took 152.4s, beyond the website timeout. See ENGLISH-MODEL-EVALUATION.md and raw v3 evidence. The model file is complete; no further download needed. A single v4 refinement benchmark is now session 2864, runtime PID 15212, 3 inference threads. Original v3 prompts are archived as evidence/prompts-english-v3-source.txt. No inference is enabled for the site. Final production rebuild follows benchmark to avoid concurrent heavy work.

## Owner inference decision reached — 2026-10-09

English v4 completed and is rejected. Median first token 28.6s; memory+answer pipeline 68.8s; sampled working set peak 1.84GiB. Price/contact checks improved, but structured exclusions/domain classification and attachment-capability honesty still fail. All three tested hardware-fit candidates remain unapproved. Read docs/OWNER-AI-DECISION-2026-10-09.md and latest ENGLISH-MODEL-EVALUATION.md. This is the self-hosted directive's explicit owner gate, not project completion.

Independent brief/context UI fixes are complete in source. Twelve assistant tests passed. Final lint, production build and TypeScript passed; local production preview is running in session 11237 at 127.0.0.1:4180. Home HTTP 200 and AI status available=false verified. No inference runtime/download/benchmark remains active. No external AI, purchase or public deployment. Actual accepted-model UI and Persian tests remain pending. The heartbeat was already PAUSED and remains paused.

Next needs owner target choice: an existing stronger owned computer, prepare a private self-hosted hosting plan for approval, or keep AI disabled pending hardware. Do not restart rejected candidate benchmarks or download larger weights on this machine without a changed target/reason. Latest direct conversation no longer requires Astra for all work; use the owner's current app selection, and do not claim a model/effort setting was changed without verification.
