# Owner-requested hover, light ribbons and contact icons — 2026-10-09

The owner's latest instruction restores mouse hover playback, superseding the previous button-only preview optimization. Every visible card, including side cards, responds to mouse pointer entry; pointer exit pauses immediately. Sources remain lazy, only one preview plays at once, carousel selection stops previous playback, and touch retains its explicit Preview button.

The approved three-dimensional torus motion and selection acceleration are preserved. Appearance now uses a tapered cyan luminous band, white core, two parallel blue/cyan filaments and sparse traveling light beads, based on the actual 2–6 second Hero reference contact sheet.

Shared contact links now include native SVG icons for email, telephone, WhatsApp, Instagram and location, in both the final CTA and footer.

Verification: lint, two meaningful torus geometry tests and production build including TypeScript passed. Independent headless Microsoft Edge confirmed central-card hover, side-card hover, stopping on exit, a single simultaneous preview, five footer icons and no mobile horizontal overflow or JavaScript errors. Desktop/mobile screenshots were inspected: docs/evidence/hover-ribbons-contacts/. Local preview restarted at http://127.0.0.1:4180/ (session 38585). This is local evidence, not public deployment or real OpenAI activation.
Additional browser regression check passed for admin login/editor, mobile, keyboard reduced-motion navigation and preview lifecycle. Wheel measurement with hover video enabled: median frame 16.7ms, p95 33.2ms, three frames over 50ms, one playing preview. The prior 16.9ms p95 was measured with hover playback disabled, so it is not an equivalent configuration. Headless browser measurements are not a guarantee for every device.
