# Floating MOSAIX assistant — 2026-10-08

Implemented the owner's current direction in the existing website:

- Small blue rotating orb at the bottom right, with two restrained moving light filaments and a soft halo.
- English welcome after 120 seconds of visible browsing, once per browser-tab session: “Hello, welcome! I’m MOSAIX. How can I help you?”
- Clicking the orb, welcome or AI navigation button opens a native modal within the current page. Chat is loaded only on first open. The old /ai address redirects home.
- Escape, close button and backdrop dismissal; background scrolling/focus is constrained while open. Closing preserves the unsent draft and page position, aborts an active response and restores focus. Mobile menu closes before showing the chat.
- Verified company knowledge and instructions explicitly forbid service prices, ranges, estimates and hypothetical examples. Pricing questions must go to the approved email/phone/WhatsApp. The chat includes a visible direct-contact pricing note. A voluntarily supplied budget remains a project constraint.
- English response presentation uses clear paragraphs, lists and code blocks. No model-generated HTML or executable links are rendered.

## Verified

Production build, TypeScript, ESLint and 11 assistant tests passed. HTTP/service checks covered 18 routes, 12 internal homepage links, the five correct continuous service videos and official contact/process content. Live desktop verified the animated orb, actual delayed welcome and in-page opening. Live 390×844 and 390×500 viewport checks verified layout, composer, controls, Escape, draft persistence, preserved scroll and the corrected collapsed-menu focus return. No browser console errors in the final interaction review.

## Not yet accepted

The actual AI model is not enabled. Both tested tiny local candidates failed English grounding/strategy. Qwen3.5 2B Q4_K_M is still downloading with resume/SHA256 validation, followed by the stricter English v3 tests, including price and estimate workarounds. The visible welcome is a normal interface greeting, not an AI-generated response or evidence that the runtime is ready. Real successful conversation, streaming, context and brief handoff tests await an accepted model. Persian remains the last phase. Actual mobile soft-keyboard/device behavior is not represented by viewport emulation. No public deployment or external AI API was added.

Preview: http://127.0.0.1:4180/
See OWNER-SELF-HOSTED-AI-STATUS.md for the current process checkpoint and ENGLISH-MODEL-EVALUATION.md for completed model results.

2026-10-09 update: 2B download completed and two English evaluations failed acceptance. Twelve assistant tests, final lint/build/types passed after brief preservation/focus improvements. No AI inference is enabled. See OWNER-AI-DECISION-2026-10-09.md for the required next target decision.
