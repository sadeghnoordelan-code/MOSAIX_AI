# Final playback repair and private release — 2026-10-12

The Website background and selected portfolio previews now recover automatically after external-link returns and Website-card re-entry. No page refresh is used by the recovery controller.

## Findings and changes

Two persistent failure modes were reproduced in Chromium and WebKit before the correction: page suspension remained set when only visibilitychange arrived on return, and an unresolved play promise permanently prevented further playback attempts. The shared controller now clears suspension on visible return/user re-entry, preserves the canonical video source, invalidates stale playback attempts, and repairs a stalled media element with bounded retries while retaining its playback position. Hidden/offscreen playback remains paused, preview selection remains exclusive, and explicit user pause is respected. Autoplay denial shows the existing retry control without an endless retry loop.

Changed application files: src/features/media/keep-video-playing.ts, src/features/services/website-portfolio.tsx, src/features/services/service-world-video.tsx.

## Verification

- Production build, TypeScript, lint and all 34 project tests passed.
- Final browser regression: Chromium/Edge and WebKit, desktop 1440px and mobile 390px, all four portfolio sites. Each of 16 cases passed real external popup return, home-to-Website client re-entry without document reload, and native browser-back return from a same-tab external site. Playback was checked using decoded image changes as well as native video time.
- Four contexts passed missing-pageshow and unresolved-play regressions, explicit pause and offscreen checks; no page errors.
- Focused transient AbortError and denied-autoplay/manual-retry checks passed in both engines.
- Actual in-app browser checks passed the four portfolio selections and three home-to-Website re-entries. The in-app browser handed external links to another browser, so those destination visits were verified separately by the browser regression.
- Original and served media SHA256 identity checks passed. This is desktop engine emulation, not a claim of testing every physical handset. Browser-back did not retain the prior document in the observed runs; real bfcache restoration is not claimed.

Evidence: docs/evidence/final-playback-2026-10-12/baseline.json, regression.json and release-audit.json; focused failure evidence: docs/evidence/playback-return-2026-10-12/failure-recovery.json. Reproducible local scripts: scripts/verify-final-playback.mjs and scripts/verify-return-media-errors.mjs.

## Private publication authorization and current blocker

The owner explicitly authorizes uploading MOSAIX to https://github.com/sadeghnoordelan-code/MOSAIX_AI and deploying it through Vercel, with both repository and every deployed URL private. This supersedes earlier preparation-only/no-MOSAIX-push instructions. Shutdown is authorized only after all requested work is finished.

Both github.com and vercel.com remain blocked by the browser tool's saved user permission setting, even after the owner's latest statement that both settings were changed. The tool explicitly forbids reaching the same blocked outcome using another tool or route. No CLI/API/alternate-browser workaround was attempted. No remote upload, deployment, repository visibility verification, or private live URL is claimed. PC shutdown is deferred because publication is not complete.

## Ready release and cloud setup gates

The local release includes site source, original/served media, content, Arabic/English localization, tests, documentation and deployment workflow. Environment files, owner credentials, local sessions/conversations/storage, dependencies, build output and model files are excluded. The release audit checks candidate file names, common literal credential patterns and GitHub's single-file limit; this does not replace account-level access verification.

OpenAI, Upstash Redis and Vercel Blob credentials are not configured. Local owner credentials are configured and remain private. The cloud admin requires persistent Redis storage; actual AI replies require the server-side OpenAI key. No account purchases or paid calls were made.

Once the saved permission blocker is removed, inspect the target repository and preserve any existing history; confirm Private before upload. In Vercel configure Authentication with All Deployments protection before creating any externally accessible deployment. Standard Protection does not protect production domains. Verify unauthenticated access to every deployed domain is blocked. noindex is retained but is not access control. Official source: https://vercel.com/docs/deployment-protection . Link the private GitHub main branch for future approved pushes, configure server-only environment variables and separate preview/production storage namespaces, then verify the cloud build, admin, media and protected URL before claiming completion or shutting down.
