# The Upallnights archive

A Next.js archive of the band's music, radio appearances, videos and final gig.

## Development

Use Node.js 20.x (20.19+), 22.x (22.13+) or 24+. Install dependencies with `npm ci`, then run `npm run dev`. Open http://localhost:3000.
Run `npm run build` for a production build and `npm run lint` for linting. After building, run `npm test` for the integration checks; the download check requires access to the Umbraco media host.

The editorial content and media URLs are in `app/data/archive.json`. Images, recordings and the stems ZIP are hosted by Umbraco; the site does not require the CMS API at runtime. The final gig video is hosted there as well.

## Project structure

- `app/`: App Router pages, shared layout and global base styles.
- `app/_components/`: components used only by the landing page.
- `app/radio/_components/` and `app/final-gig/_components/`: route-specific components.
- `app/components/`: shared audio provider/player and embedded video.
- `app/data/`: hard-coded editorial content and media URLs.
- `app/lib/`: shared download helpers; `app/download/route.js` handles downloads.

Styles live in CSS modules beside their page or component. `app/globals.css` contains only base styles and shared utilities.

## Media behavior

Downloads stream through `/download` so browsers save cross-origin recordings instead of opening them. The route only accepts URLs listed in the archive data.

Music autoplay follows the original card order: each main recording, its listed versions, then the next card (including concert tracks). Selecting a version starts at that position in the same queue. A moving underline marks the currently playing main recording; it is static with reduced motion enabled and disappears on pause or stop. Radio playback remains queued within each show.

The shared player uses custom Play, Pause and Stop controls. The fan-o-meter is visible whenever a recording is selected, including while paused. Progress survives navigation and stopping playback, but resets on a page reload. It advances when playback automatically moves to the next track, as on the original site. At 21 advances, "Verified fan diploma unlocked!" is achieved and a diploma download link appears. Clicking the link hides both the fan-o-meter and download link until a page reload; playback controls remain available. Its image URL is stored as `fanDiplomaImage` in the archive data.
