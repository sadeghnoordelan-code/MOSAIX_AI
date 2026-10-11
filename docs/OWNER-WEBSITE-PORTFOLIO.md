# Owner website portfolio — 2026-10-10

Four owner-approved website experiences are embedded in /services/website-design-development#website-portfolio: SARV, BOREAL, Lumière and Harvest Bloom. English summaries and bold feature lists prioritize the owner's stated differentiators. Each preview uses its corresponding supplied recording, cleaned of browser/toolbars and re-encoded as muted H.264 MP4, yuv420p, faststart; originals are retained. The four derived clips total approximately 13.5 MB. Posters are small extracted JPEG frames.

Clear glass containers retain MOSAIX's fixed website-world film behind the content. Desktop has side-by-side preview/copy; mobile stacks the preview above readable content. Playback starts on mouse intent with fine-pointer hover, or an explicit keyboard/touch button. Video sources are absent until requested; only one portfolio preview plays at a time. Leaving the viewport, hiding the tab or pausing stops it. Reduced-motion preferences disable decorative entry/zoom motion. External live-site links open safely in a new tab.

Owner workspace: /admin → Website portfolio. Titles, summaries, feature bullets, notices, preview/poster paths, live links and publication visibility are editable. Items can be added or removed even after the list is emptied. Server validation checks media, links and unique slugs. Existing saved CMS overrides merge with this new default section.

Verified against owner public GitHub sources and deployed pages:
- SARV: features/projects.ts and app/page.tsx contain style/size/palette/project filters and colour-match concept studies.
- BOREAL: js/booking.js holds the viewing flow in client state; it does not submit a real reservation.
- Lumière: README, js/api.js and js/payment.js describe simulated availability and an unconnected payment placeholder. Services, before/after comparisons, clinician information and treatment-plan flow exist.
- Harvest Bloom: OrderSummary.jsx and README show live weight/amount/cart recalculation and a payment-provider interface. No provider is connected and collection-appointment scheduling is not present in the reviewed main-branch source/deployed page. Its scheduled in-person collection is explicitly described as the intended fulfilment journey.

No numerical MOSAIX service price is published. Product amount recalculation is described as a storefront capability. No payment, external booking or public deployment was activated by this task.

The welcome and assistant orb now share the floor-ring light-trail renderer scaled around the sphere, with rear/front depth layers and no old SVG orbital strip. Four floor bundles remain. Touch carousel click suppression resets for a fresh touch; hover playback is limited to devices advertising fine-pointer hover.

Validation evidence: docs/evidence/website-portfolio. Browser QA status is recorded in verification.json only after every check passes. Physical iPhones/Android devices are not claimed.

Final validation: lint, production build/TypeScript and six admin tests passed. All 24 previews passed across Chromium and WebKit at widths1440/390/320 with zero page errors or horizontal overflow. Final main carousel touch behavior and actual WebKit navigation/orb checks passed. CPU4x stress: median16.7ms,p9550ms,5frames over50ms; this is not a physical-device benchmark.
