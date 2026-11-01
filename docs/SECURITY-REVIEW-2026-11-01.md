# Security maintenance — 2026-11-01

The previous release used Next.js 16.3.8 with critical remote-code-execution advisories. This release upgrades Next.js to 16.4.3 and Vercel Blob to 2.8.2. Compatible transitive overrides require Undici >=6.29.1 (within major 6) and Zod >=4.6.7 (within major 4). The lockfile records the resolved packages. Sharp resolves to 0.35.5.

## Application protections

- Admin and AI mutations share the same configured-origin and request-host validation. Production no longer trusts development loopback origins merely because the host is not Vercel. Missing or malformed browser origins fail closed.
- Production admin and AI session cookies always carry Secure, including logout responses. Existing HttpOnly, SameSite=Strict, session expiry, signed admin sessions, CSRF validation and request quotas remain in place.
- API responses receive no-store caching and a restrictive content security policy, including error responses. Production responses receive HSTS. Existing page nonce-based CSP, anti-framing, MIME protection and restricted permissions remain in place.
- The image optimizer explicitly rejects SVG and local-network sources and does not follow remote redirects. Its remote allowlist remains restricted to Vercel public Blob hosts.
- Security regression tests cover production origin/host validation, mandatory secure cookies and chunked body-size limits. The GitHub workflow checks production advisories, has a read-only token, does not persist checkout credentials and has a 15-minute limit.

## Dependency audit scope and remaining tooling advisory

The npm registry bulk advisory API returned no advisories for the production lockfile package versions after the updates. The complete dependency tree still reports GHSA-g3hv-75wg-m249 in development-only minimatch versions used by ESLint and its plugins. This advisory concerns attacker-supplied glob-pattern amplification; these tools process repository-controlled patterns during development/CI and are not called by visitor HTTP requests. No compatible patched major-3 minimatch release was available at the check. Forcing minimatch 11 into consumers expecting a callable major-3 API would break the lint toolchain, so this report does not claim a clean full development-tree audit. Reassess when the upstream consumers publish compatible updates. CI execution is bounded; untrusted code should not receive production secrets.

References:

- https://github.com/advisories/GHSA-2464-fhr4-w9xw
- https://github.com/advisories/GHSA-673q-mjm6-r5xr
- https://github.com/advisories/GHSA-g3hv-75wg-m249

## Limits

This is a dependency, source and targeted runtime review, not a penetration-test certification or a guarantee against every vulnerability. It does not prove or disprove past compromise. No credentials were rotated, no paid service was created, and no DNS/account access settings were changed. Account-level MFA, credential rotation and paid infrastructure actions remain owner-managed. Publication and live-domain verification are recorded separately after the release commit exists.

## Validation before publication

All 50 unit/regression tests passed, including the two new security tests; full ESLint passed. Next.js 16.4.3 production build and TypeScript checks passed. An isolated local production server with synthetic credentials verified successful owner login, secure cookie flags, CSRF rejection, origin rejection, logout invalidation, login rate limiting, unauthenticated API rejection, no-store API headers, HSTS and nonce-based page CSP. No production login brute-force or paid AI calls were performed. Pattern scans of 380 tracked text files and Git history found no credential matches; exact configured server secrets and complete credential patterns were absent from the final client bundle. A private-key format marker in a bundled SDK parser was inspected and excluded because it contains no key material. These scans are limited to the stated patterns and available local secrets.
