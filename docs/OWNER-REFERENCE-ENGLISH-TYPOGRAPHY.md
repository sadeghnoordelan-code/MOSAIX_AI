# Reference-inspired English typography — 2026-10-13

Owner reference: 1000121880.jpg. Follow-up: wide tracking only on the logo; ordinary text must use natural, readable spacing. This is a close geometric type choice, not an identification of the custom lettering in the reference.

Implemented locally hosted Josefin Sans (Fontsource 5.3.0, OFL license) with static 300/400/500/600/700 WOFF2 weights and Latin/Latin-ext subsets. The variable candidate rendered too thin in the Windows WebKit engine; static weights fixed the observed rendering. No runtime external font service is needed.

English CMS default, global tokens, headings, body copy, links, controls, assistant, contact numerals and private admin use the new family. Changa remains the Arabic font with Josefin Sans for Latin text. Valid prior Space Grotesk/Raleway owner choices remain supported.

Logo wordmarks: 0.30em in header/footer, 0.38em in welcome and 0.35em in the branded entry curtain. Ordinary English text uses natural tracking; selected small labels use a restrained 0.035em. Original service card dimensions, shapes, media and motion code are unchanged.

Validation on the final static-font production build: six existing admin/content tests, lint and Next production build/TypeScript passed. Twenty Chromium/WebKit font/layout cases passed: English home, studio and website world at widths 1440/390/320, plus Arabic home at390 in each engine. No horizontal overflow or page errors; heading/copy families and original card dimensions verified. Native canvas alpha coverage for semibold vs light was 2.29 in Chromium and 2.27 in WebKit, confirming distinct rendered weights. Desktop and mobile screenshots were inspected, including WebKit portfolio and320px Hero. Evidence: docs/evidence/reference-font-2026-10-13/. These are browser-engine checks, not physical handset coverage or a new complete playback audit.

Current local production preview: http://127.0.0.1:4180/?lang=en&preview=reference20261013 (session58783). No API configuration, domain or external publication changed. Private GitHub/Vercel publication remains subject to the previously recorded saved-permission block; no bypass attempted. Older release ZIP snapshots predate this typography change.
