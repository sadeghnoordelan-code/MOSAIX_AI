# MOSAIX Official Website

Canonical project: `E:/MOSAIX_AI/Projects/MOSAIX-AI Website`.
Local preview: http://127.0.0.1:4180.

The site includes the branded welcome sequence, Hero, perspective service carousel with animated blue light rings, continuously playing service worlds, studio portraits, process and project/contact pages. Original videos are preserved unchanged. No unverified project or live Lab-tool records are published.

## MOSAIX AI

The floating blue MOSAIX orb opens a conversation panel within the current page. It includes the private-model streaming backend, temporary context, verified local knowledge and editable project brief. The legacy `/ai` address redirects home. It is **not enabled or quality-approved yet**. English is the owner's current priority; Persian comes last. Actual benchmark outcomes are in [the English review](docs/ENGLISH-MODEL-EVALUATION.md), with operational state in [the current checkpoint](docs/OWNER-SELF-HOSTED-AI-STATUS.md).

Inference stays on a private self-hosted runtime. No external LLM or embedding API is configured. Private runtime files are ignored by Git. No service price or estimate is provided in chat; pricing requests go to official team contacts. No email is sent by the assistant; users review and send their own draft.

## Development

Use `npm ci`, then `npm run dev`. For a production preview, run `npm run build` then `npm run start`. `npm run test:ai` checks assistant boundaries and text handling. `npm run verify` checks media identity, content registries, lint, build and types.

## Publication

This is a local preview. `SITE_URL` remains unset and indexing is disabled. Public hosting, production model capacity and any recurring hosting cost still require an owner-approved destination and plan. No public release is claimed.
