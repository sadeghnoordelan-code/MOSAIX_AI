# Lumière Dental Studio

A premium, minimalist dental clinic website. Pure white ground, medical teal accent,
charcoal headings, neutral-gray secondary text. Mobile-first, fully responsive, and
structured so a backend can be added without a redesign.

---

## Run it

```bash
python serve.py
```

Then open <http://localhost:5173>.

### Why not `python -m http.server`?

The hero decodes its frames in a worker, which needs to be loaded from an HTTP origin;
and the `<video>` fallback scrubs by setting `currentTime`, which a browser only permits
when the server advertises **`Accept-Ranges: bytes`** and answers range requests with
`206 Partial Content`. Python's built-in `http.server` does neither usefully, so the
fallback's `video.seekable` comes back empty and the hero sits frozen on its first
frame.

`serve.py` is a small range-aware static server that fixes exactly this. Every real host
(nginx, Apache, IIS, Vercel, Netlify, Cloudflare Pages, S3 + CloudFront) handles ranges
correctly out of the box, so it is only needed for local preview.

Opening `index.html` straight from the filesystem mostly works — all scripts are classic
(non-module) scripts and no data is fetched over the network — but `file://` blocks the
worker and gives a non-seekable video, so the hero will not scrub. Use the server.

---

## Structure

```
index.html            landing page — every section
payment.html          checkout placeholder + confirmation screen
serve.py              range-enabled dev server

css/
  styles.css          design tokens, all components, responsive, RTL + print rules
  payment.css         checkout screen only

js/
  data.js             ← ALL English content: clinic, services, cases, doctor, reviews, FAQ, schedule
  data.fa.js          ← the Persian mirror of every collection above
  i18n.js             UI string dictionaries (en/fa) + the language engine
  icons.js            inline SVG icon set
  api.js              money/date helpers, availability simulation, pricing, LUMIERE.api
  ui.js               rendering, header, reveals, before/after slider, FAQ, toasts
  booking.js          plan store, calendar, slots, invoice, checkout hand-off
  hero-video.js       wheel-driven hero: input, easing, frame cache
  hero-frames.worker.js  mp4 demuxer + WebCodecs decoder, off the main thread
  payment.js          checkout screen
  main.js             bootstrap

assets/
  video/hero.mp4      the uploaded hero footage (1280×720, H.264, 10s)
  img/*.svg           before/after illustrations, portrait, map, favicon
```

---

## Languages — English & Persian

A language switch sits in the bar above the header, and again in the checkout header.
The choice is saved to `localStorage`, so it survives reloads and carries across to the
payment screen. `?lang=fa` also works, and a Persian browser locale is detected on a
first visit.

Switching language **never loses state**: selected treatments, the chosen date, the
time slot and anything already typed into the form all survive the switch and simply
re-render in the new language.

Two mechanisms sit behind it:

- **UI strings** live in the `EN` / `FA` dictionaries in `js/i18n.js` and are read with
  `t('key')`. Static markup is tagged `data-i18n`, `data-i18n-html` (for strings that
  carry an `<em>`) or `data-i18n-attr` (for placeholders and ARIA labels).
- **Content collections** are swapped wholesale. `applyContent()` repoints
  `LUMIERE.SERVICES`, `CASES`, `DOCTOR`, `TESTIMONIALS`, `FAQ`, `TRUST` and `CLINIC` at
  the Persian pack, so no renderer needs to know which language is active.

To add a third language: add a dictionary to `i18n.js`, add a content pack shaped like
`data.fa.js`, and add a button with `data-lang="xx"`. Nothing else changes.

### Persian specifics

- The page flips to `dir="rtl"` and switches to **Vazirmatn**. Only physical-direction
  properties needed mirroring — anything built on flex, grid or `padding-inline`
  mirrors itself.
- Numbers, prices and dates render in Persian-Indic digits.
- **The calendar stays Gregorian.** Intl is pinned with `fa-IR-u-ca-gregory`; without
  that extension `fa-IR` silently switches to the Jalali calendar, which the brief rules
  out. Persian users get Persian month names on Gregorian dates.
- Phone numbers typed in Persian digits validate correctly — they are normalised to
  ASCII before checking, and the booking payload carries a dial-able `phoneDigits`.
- The before/after slider is deliberately **not** mirrored: the photographs keep their
  real orientation, so *before* stays on the left and *after* on the right.

---

## The hero

The video **never plays**. There is no `autoplay`, no `controls`, no play button, and
`pointer-events: none` so it presents no interaction surface at all. The hero is one
screen tall and the **wheel drives the film directly**: while it fills the viewport it
takes the wheel, and at either end of the timeline it lets go so the page scrolls on
normally.

### The input chain

    wheel  ->  accumulated target progress  ->  eased render progress  ->  frame

No wheel event is ever mapped straight to a seek. Deltas are normalised to pixels first
(`deltaMode` 0/1/2), so a trackpad and a wheel mouse feel the same — Chrome's 100 px notch
and Firefox's 3-line notch both move **1.77 frames**. That is the floor; rolling harder
raises the gain smoothly, up to 6x, so the far end stays about 25 notches away instead of
160.

### Why the frames are decoded by hand

The footage carries a keyframe only every 29 frames, so asking a `<video>` to seek frame
by frame costs a whole GOP decode each time — measured on this file at **23 ms median,
35 ms worst**, which caps the scrub near 30 fps and makes it lurch. So `hero-frames.worker.js`
demuxes the mp4 itself and decodes it with **WebCodecs**, off the main thread, at ~1.1 ms
a frame. Decoded frames are handed back as `ImageBitmap`s and blitted to a canvas in
**0.007 ms** — once a frame is cached, showing it costs nothing.

Three rules keep it continuous at any wheel speed:

1. **Decode along the path.** The worker is asked for the group under the head, the one a
   prefetch ahead, *and* the one at the destination the wheel has already committed to —
   otherwise every group arrives already stale during a fast roll.
2. **The head may not outrun its frames.** Each tick the head is clamped to the contiguous
   run of frames actually in hand. Without this the head sprints over undecoded ground and
   the picture catches up in one hop — a jump, however smooth the numbers underneath.
3. **Speed follows measured throughput.** The renderer times each group from request to
   arrival and caps the scrub at the rate it is really being fed, plus a hard limit of 8
   frames per tick so one long frame can never spend its whole budget at once.

Measured on the real footage, per tick: **1-frame steps scrubbing slowly, at most 8 under
a hard flick**, in either direction, with the painted frame never more than one frame off
the head. Backwards is the same, which is the hard direction for H.264.

The frame cache is budgeted in megabytes rather than frames (180 MB, 300 MB where the
device reports 8 GB+), since a decoded frame costs `width x height x 4` bytes. Frames are
cached at the resolution the stage actually needs, and evicted by usefulness — what is
behind you goes first.

If WebCodecs, the worker or the decode is unavailable, the hero falls back to the paused
`<video>` with eased, single-in-flight seeking, driven by the same input chain. iOS refuses
programmatic seeking on a video that has never received a user gesture, so one muted
`play()`/`pause()` pair runs on first interaction. Nothing is ever audible or played.

Under `prefers-reduced-motion: reduce` the hero holds one still frame and **never touches
the wheel** — the page scrolls normally.

### On phones and tablets

The hero is `100svh`, not `100vh`, so a collapsing URL bar cannot resize it mid-scroll.

**Touch devices do not scrub at all.** A phone will not repaint a seeking `<video>` while
the compositor owns the scroll, so the frame freezes during the swipe and lurches when it
ends — no amount of easing or seek throttling fixes that, because the repaint never
happens. On a coarse pointer the hero therefore becomes a single-screen panel with the
same footage playing inline (muted, looped, `playsinline`), no runway and no scrubbing.

That is a deliberate departure from the original "no autoplay" rule, and it applies to
touch devices only. To go back to scrubbing on phones, set `TOUCH_HERO = false` in
`js/hero-video.js` — it will work, it will just judder during momentum scrolling.

If the device will not scrub at all — iOS Low Power Mode, Data Saver and a failed decode
all cause this — the hero adds `.hero--static`, collapses to exactly one screen and shows
the lead caption over the gradient backdrop. Without that guard the page presented
several screens of blank white, which is what a stalled sticky hero looks like. A first
touch gesture also re-tests the video and restores the full scrolling hero if the device
has since cooperated.

---

## Booking flow

Clicking **anywhere on a service card** pre-selects that treatment and scrolls to the
booking section. The **Add to plan** button toggles the treatment without navigating, so a
multi-treatment plan can be built first.

- Fixed **two-hour slots** from 10:00 to 22:00.
- **14:00–16:00 is always blocked** as lunch and sterilisation — rendered, labelled and
  never selectable.
- Unavailable slots are visually disabled and cannot be selected: already booked, past the
  90-minute same-day lead time, or after an early close.
- Sundays are closed; Saturdays close at 18:00; the calendar opens 90 days ahead.
- Occupancy is a **deterministic simulation** — an FNV-style hash of `date + slot`, so
  slots never reshuffle while the user is looking at them.

Once a **date and time both exist**, the invoice generates automatically: individual
treatment prices with chair time, the consultation fee, a multi-treatment courtesy when
three or more treatments are selected, and the final total. It updates live as the patient
types their name.

**Proceed to Payment** validates name and phone, builds the booking, and hands it to
`payment.html` through `sessionStorage`.

---

## The payment screen is a placeholder

`payment.html` is deliberately **not** connected to a payment gateway:

- the card fields are `disabled`, watermarked *"Gateway not connected"*, and pre-filled
  with bullet characters;
- **no card data is collected, stored or transmitted** anywhere;
- an amber banner states this in plain language at the top of the screen;
- **Confirm appointment** simply moves to a success state with a booking reference.

---

## Wiring a backend

Everything that a deployment would fetch over the network already goes through
`LUMIERE.api` in `js/api.js`, and every method already returns a Promise. Replace each
body with a `fetch()` and nothing else in the codebase changes:

| Method | Suggested endpoint |
| --- | --- |
| `getServices()` | `GET /api/services` |
| `getAvailability(date)` | `GET /api/availability?date=YYYY-MM-DD` |
| `getMonthAvailability(y, m)` | `GET /api/availability?from=&to=` |
| `getQuote(serviceIds)` | `POST /api/quote` |
| `createBooking(payload)` | `POST /api/bookings` |

Pricing lives in one function (`quote()` in `api.js`) and returns the exact shape the
invoice renders, so a server can become the pricing authority by returning the same object.
The newsletter handler and the payment confirm handler both carry a comment marking where
their request belongs.

Persistence uses `localStorage` for the treatment plan and patient details, and
`sessionStorage` for the checkout hand-off — swap for real session handling as needed.

---

## Replacing the placeholder content

All of it lives in `js/data.js`. Nothing is hard-coded into the markup.

**Everything below is fictional and must be replaced before launch:** clinic name, address,
phone numbers (drawn from Ofcom's reserved fiction range), email, the clinician, the
patient reviews, and all prices.

The before/after images and the portrait are generated SVG illustrations, not photographs.
Swap them for real clinical photography using the same filenames and aspect ratios
(3:2 for cases, 9:11 for the portrait) and no CSS changes are needed. The map is a styled
placeholder — drop an `<iframe>` or a map SDK into `.map` when you have coordinates.

---

## Accessibility & performance notes

- Semantic landmarks, a skip link, visible focus rings, and `aria-live` on the invoice.
- The before/after slider is a real `role="slider"`: arrow keys, `Shift` for larger steps,
  `Home`/`End` for the extremes.
- Service cards are keyboard-operable (`Enter` / `Space`).
- `prefers-reduced-motion` is honoured throughout.
- A print stylesheet renders the invoice alone as a clean document.
- Images below the fold are lazy-loaded; the icon set is inline SVG; there are no
  JavaScript dependencies of any kind.

### Before going live

- Add a `poster` frame so the hero has something to show on the very first paint.
- A denser keyframe interval (`ffmpeg -g 15`) would speed up the `<video>` fallback on
  browsers without WebCodecs. The main path decodes the file itself and does not care.
- Self-host the two Google fonts to remove the third-party request.
