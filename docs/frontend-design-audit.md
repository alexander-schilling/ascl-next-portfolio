# Portfolio experience audit

## Baseline and direction

Audit date: 2026-10-03. Preserve mode, design variance 6, motion 4, density 3.
The audience is recruiters, collaborators and visitors interested in Alexander's
photography. Keep the dark navy identity, Figtree/Raleway, lavender primary,
existing AS logo, actual photographs and CMS copy. No generated portfolio images.

Preserve `/es`, `/en`, all existing section IDs, navigation labels, CV files,
social/contact destinations, canonical URLs, metadata and language alternates.
The section order remains hero, about, experience, photography, community, contact.
There are no forms, pricing, testimonials or analytics changes in this scope.

Current tokens: background #0b1326, foreground #dae2fd, primary #c0c1ff,
secondary #6bd8cb. Existing corners vary between 8 and 40px. Prefer 16px
photographic frames, 12px compact surfaces and 8px controls; reserve pills for language selection.
Use primary for interactive controls; retain established teal/orange content tones.
Header layer is 40, keyboard skip link 50, native dialogs use the browser top layer.

## Findings and proposed treatment

- Hero wraps into four large lines at the current 919px browser width. Reduce
  its responsive type scale, remove the animated scroll cue and keep both CTAs visible.
- Mobile header has no section navigation. Add a localized accessible menu,
  preserving the desktop links and destinations.
- Photography downloads every original solely to discover its aspect ratio.
  Replace this with stable photographic frames and lazy optimized thumbnails;
  open the complete image only when a visitor requests the viewer.
- Viewer has no focus containment/return and is nested under transformed content.
  Use a native modal dialog in a body portal, with keyboard navigation,
  localized controls, reserved image space and loading/error feedback.
- Cards contain a link nested inside a button, with actions hidden on touch.
  Separate the photo button from an always available Instagram link.
- Reveal CSS hides server-rendered sections without JavaScript. Make content
  visible by default and enable animation only below the viewport after hydration.
- Section titles use divs and skip heading levels. Restore h2/h3 hierarchy and
  provide a localized skip link. Increase touch targets and low-contrast text.
- Contact padding and CTA widths consume mobile space. Simplify the decorative
  grid, scale spacing down on mobile and let contact controls wrap naturally.

## Validation

Automated: ESLint, TypeScript, production build, 29 Vitest tests and four deployment
helper tests pass. Local Google Fonts compilation required the system TLS trust
store (`NEXT_TURBOPACK_EXPERIMENTAL_USE_SYSTEM_TLS_CERTS=1`); no certificate
verification was disabled. Build uses the existing dynamic runtime content flow.

Browser checks: 320x740 English, 390x844 Spanish/English and 1280x900 desktop.
Verified menu opening, Escape, section navigation, language changes preserving
the section hash, no horizontal overflow, gallery of 12 actual Instagram photos,
full-image viewer, previous/next arrow keys, Tab/Shift+Tab wrapping, Escape,
focus return and modal language. Desktop section indication uses a narrow
IntersectionObserver band below the header, including tall sections.

Template stock photos are retired from the loading fallback. Existing CMS photos
remain available as fallback; without any photos, a localized unavailable state
and the existing Instagram profile link remain. The client request is canceled
on unmount and bounded to 15 seconds. Thumbnails have stable frames and loading,
error states; the viewer preserves the complete image with `object-contain`.

Preflight reviewed: existing dark brand retained, primary interactive accent,
consistent radius scale, no decorative scroll cue or contact SVG grid, two hero
lines at desktop, visible CTAs on the tested production mobile viewport, header
80px, real assets, meaningful motion with reduced-motion override, semantic
headings, lazy thumbnails, loading/error states and no per-scroll listeners.
Existing CMS copy, its longer paragraphs, status label, location and content
accents are deliberately preserved under the skill's preserve redesign mode.
Forms, serif fonts, pricing, logo walls, bento comparisons, marquees, quotes,
GSAP and a new theme system are not applicable to this focused change.

The available in-app browser does not expose a Lighthouse runner. No Lighthouse
score or measured field Core Web Vitals claim is made. Performance improvements
are structural (no original-image preloading, reserved frames, observer-driven
navigation); production field LCP/INP/CLS still need measurement.
