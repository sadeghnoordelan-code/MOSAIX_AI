# Baseline model evaluation — 2026-10-06

These are actual synthetic test conversations generated on the owner workstation, not estimated benchmark claims. Both baseline candidates fail quality. Neither is enabled for the website. Raw responses are preserved in docs/evidence/local-ai-qwen3.5-0.8b-q4_0.json and local-ai-qwen3-0.6b-q8_0.json.

| Quantized model | Cases | Median first token | Response range | Peak sampled working set | Decision |
|---|---:|---:|---:|---:|---|
| qwen3.5-0.8b-q4_0 | 11 | 34.3s | 34.4–116.7s | 1.58 GiB | Rejected baseline |
| qwen3-0.6b-q8_0 | 11 | 40.3s | 42.9–120.0s | 1.96 GiB | Rejected baseline |

Qwen3.5 0.8B Q4_0: Persian degenerates into repetition; an English clinic question is answered in repetitive Arabic; the architecture answer confuses the visitor's studio with MOSAIX; video planning exceeds the requested 20 seconds and is incoherent. Location was correctly grounded, and the obvious fake-facts injection was refused. Structured state/context generation failed. This is not an acceptable strategist.

Qwen3 0.6B Q8_0: Persian is incoherent or answered in English; the English clinic answer jumps to selling AI rather than diagnosing booking friction; the app-price answer falsely states that MOSAIX does not charge for development. No-image response pretends to refer to supplied dimensions and then loops. Location and contact were correct. Structured extraction and contextual reply completed, but extraction treated an assistant suggestion as a decision and the reply ignored the requested Persian language. The injection case explicitly repeated fabricated employee count and price and falsely claimed an email had been sent. A correct location alone does not offset critical grounding failures.

Manual qualitative scores (1 poor, 5 strong; diagnostic, not an objective benchmark index):

| Dimension | Qwen3.5 0.8B | Qwen3 0.6B |
|---|---:|---:|
| Persian naturalness | 1 | 1 |
| English language compliance/naturalness | 2 | 3 |
| Strategic reasoning | 1 | 2 |
| Useful disagreement | 2 | 1 |
| Website/product reasoning | 1 | 2 |
| Automation reasoning | 1 | 2 |
| Architecture/interior reasoning | 1 | 1 |
| Creative/video reasoning | 1 | 1 |
| Instruction following | 1 | 1 |
| Company grounding | 2 | 1 |
| Hallucination resistance | 2 | 1 |
| Coherence across cases | 1 | 2 |
| Latency against provisional targets | 1 | 1 |
| RAM efficiency under baseline settings | 2 | 1 |

Important measurement caveat: tests ran on the development workstation with desktop tools open, not a dedicated isolated server. The runtime's default prompt-cache budget was later discovered to be 8192 MiB, which allowed memory growth between requests. The launcher is now explicitly capped at cache-ram=0 with idle-slot cache disabled. Baseline timings must not be presented as the final tuned-runtime performance.

Owner steering now prioritizes English and defers Persian until the final stage. Next comparison uses compact relevant facts, explicit English output, and the corrected memory configuration. A 2B Q4_K_M candidate is being downloaded from the quantizer's source with its SHA256 verified before use. Do not accept either baseline or claim English quality is complete until new evidence passes.
