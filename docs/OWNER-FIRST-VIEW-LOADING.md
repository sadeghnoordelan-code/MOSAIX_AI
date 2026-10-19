# Faster first view with complete films

Owner-authorized revision, verified 2026-10-20 (Tehran). This supersedes the October 15 requirement to download every film before opening the site.

The welcome screen now waits for the current route's opening film, its poster, the brand image, fonts, native readiness and an actually playing first frame. Home uses Hero; a service uses that service's background film. Routes with no opening film do not wait for unrelated videos. There is still no timer that reveals an unfinished opening film.

Other films begin preparation after entry. Existing full-response, byte-length and hash verification remain mandatory before a playback URL is exposed. Cache Storage and native byte-range playback are preserved. A newly requested service moves ahead of queued background films; at most two downloads run concurrently. Already running transfers are not aborted.

Service cards, website previews and advertising films keep their posters with a small local progress/retry indicator while downloading. Film controls which require a prepared source stay disabled until it is available. Retrying one failed film does not reopen the site-wide loading screen. Service-entry curtains retain their actual-first-frame gate and can retry a failed download.

The home entry-film payload is now 2,438,724 bytes desktop or 1,062,256 bytes mobile, rather than gating on all 32,501,754 / 16,300,239 bytes respectively. This reduces the video bytes required for initial entry by about 92.5% / 93.5%. These are video payload sizes, not total page transfer or a universal load-time guarantee. Original media and derivative picture/audio files are unchanged.

Validation:
- All 48 unit/contract tests passed, including current-route selection, queued service priority, complete-response integrity, partial/truncated-file rejection, range playback and private-route isolation.
- Full lint passed. Final production build and TypeScript passed. After removing two duplicate translation keys detected by the first build, Arabic tests and targeted translation lint passed again.
- Actual Chrome production-build checks on a fresh localhost origin: blocking every video kept the opening overlay in place and exposed no partial sources; restoring only Hero allowed entry with readyState 4 and actual playback while all other 15 films stayed blocked.
- Local card retry then complete-file preview playback passed. Client navigation into the website service finished its curtain only with a playing background film; its four blocked website previews retained posters and retry states.
- Simulated mobile Arabic at approximately 390px: direct advertising-service entry used the mobile background film, completed and played while all six product films stayed blocked; all six retained posters, empty playback sources and local retry controls. No horizontal overflow. Retrying ARA after removing the network fixture produced a fully prepared, actually playing mobile film.
- A no-opening-film About route reached 100% despite all video URLs being blocked. Blocking fixtures and viewport overrides were confined to the temporary local test tab and removed by closing it.

These are desktop Chrome and simulated mobile checks, not a physical iPhone/Safari guarantee. Credentials, source media, indexing policy and owner content were not changed. GitHub/Hostinger publication must be verified against the resulting commit after push.
