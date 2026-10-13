# MOSAIX self-hosted AI — owner decision, 2026-10-09

## Status

The website's in-page blue-orb assistant and backend are implemented. No inference model is approved or enabled. English acceptance is blocked by the quality of the tested small models on this workstation. Persian remains the final phase. The main website is usable independently of AI.

## Evidence

Actual workstation: Ryzen 7 3700U; 6,312,697,856 bytes usable physical RAM (5.88GiB), integrated Vega graphics. Current inspection confirmed the same physical RAM. Free physical memory after inference stopped was about 2.05GiB, not available GPU VRAM.

Three distinct quantized candidates were evaluated: Qwen3 0.6B Q8_0, Qwen3.5 0.8B Q4_0, Qwen3.5 2B Q4_K_M. The 2B file is complete and SHA256-verified. The two tiny models failed factual grounding; the stronger candidate was tested twice with targeted prompt/runtime improvements. V4 pricing and contacts improved, but attachment capability and structured memory still fail. See ENGLISH-MODEL-EVALUATION.md and evidence/local-ai-english-v3-qwen3.5-2b-q4_k_m.json and evidence/local-ai-english-v4-qwen3.5-2b-q4_k_m.json.

Latest 2B run: median first visible token 28.6s; complete memory+answer pipeline 68.8s; peak sampled model working set 1.84GiB; one simultaneous generation. These are real workstation samples, not production capacity guarantees. No model is selected for release. The candidate runtime was stopped normally.

## Implemented independent work

Floating animated blue orb, two subtle light strands, English greeting after 120 seconds of visible browsing, and chat in a native modal on the current page. English text formatting, interruption/retry/offline states, temporary bounded session context, verified local knowledge, contact-only pricing rules, explicit editable brief and user-controlled email draft are implemented. Legacy /ai redirects home.

Brief handoff now retains preferences, exclusions, confirmed decisions and contact preference. A supplied budget is labelled as a user constraint. Brief review disables background controls and returns focus when closed. Twelve assistant tests passed; TypeScript passed for the interface changes. Earlier orb/modal mobile viewport checks passed. Successful accepted-model UI streaming, brief review and actual phone keyboard checks are not claimed complete.

## Impact

Enabling a tested failing candidate would risk misleading advice and loss or invention of project facts. Smaller prompts and CPU tuning improved response time but did not produce the requested strategic assistant. Loading a larger model on this same low-memory development machine is not a credible plan for fast production chat. This is an engineering assessment from the measured performance and memory headroom, not proof that every larger model is impossible to load.

## Options and recommendation

1. Preferred: use a stronger MOSAIX-controlled computer already available. Inspect it first, then benchmark a suitable larger model and retain the same quality gate. No hardware purchase is required by this report.
2. If no owned target is available: prepare a private GPU-hosting plan for approval. MOSAIX would operate the model itself; this does not mean buying an external inference API. No account, rental or payment has been initiated.
3. Keep inference disabled while the owner supplies a stronger target. Website review and independent fixes can continue, but this does not complete the requested AI or remove Persian acceptance.

For planning only, a dedicated test target with 16–32GB system RAM and approximately 12GB GPU memory would give substantially more headroom than this workstation. This is an estimated test envelope, not a measured minimum, guaranteed throughput or hardware shopping instruction. Final requirements depend on the actual model, quantization, context and concurrency.

Possible next benchmarks include the official open-weight [Qwen3.5 4B](https://huggingface.co/Qwen/Qwen3.5-4B) and [Qwen3.5 9B](https://huggingface.co/Qwen/Qwen3.5-9B). Their official cards document model artifacts and self-hosting methods; their performance on MOSAIX conversations is untested. Model size alone does not establish acceptance. No download or installation of these candidates has been started.

## Owner decision needed

Choose the next inference target: an existing stronger owned computer, preparation of a private hosting plan, or keeping AI disabled pending hardware. Do not approve a failing model merely to finish the interface.

The owner directive E:/games/MOSAIX-AI-SELF-HOSTED-NO-API-v1.0.md §4 says: “If no local candidate passes, do not silently switch to API. Report evidence/options to Sadegh.” Sections 42–43 also require an owner decision before paid hosting or accepting a model below quality targets. That explicit gate is why inference cannot be completed autonomously on the present target. No public deployment, purchase or external AI API was performed.

Final validation: twelve assistant tests, ESLint, production build and TypeScript passed. Home responds HTTP 200; AI status is available=false. Production preview: http://127.0.0.1:4180/. New brief-panel focus behavior is implemented/typechecked; successful-model brief UI remains pending acceptance.
