# Task: make maw-photos feel thoughtfully designed, front to back

You are working in a SolidJS + Vite + Tailwind 4 / daisyUI 5 photo application
(`maw-photos-solid`). It works, and it has accumulated: nine top-level areas that each
grew their own toolbars, settings, and listing chrome, so the same idea is expressed four
different ways depending on where you happen to be standing.

The goal is not a reskin. It is coherence: one set of ideas, applied consistently
everywhere, with fewer controls than exist today.

## The core complaint

Tools and information are bound to _views_ rather than to the _thing being looked at_.
The grid is the best way to browse, but to see EXIF, comments, a histogram, a minimap, or
to edit metadata you must leave it for the detail view. That pattern repeats outward:
every listing surface in the app re-implements the same handful of toggles, with the same
keyboard letters bound to subtly different meanings, backed by its own settings context.

## Ground truth (verify each claim before relying on it)

### Media views and tools

- Views: `src/_media/View{Grid,Detail,Fullscreen,Map,BulkEdit}.tsx`
- Toolbars: `src/_media/Toolbar.tsx` (the view switcher) plus
  `Toolbar{Grid,Detail,Fullscreen,Map}.tsx`; individual buttons in `src/_media/toolbar/`
- Toolbar membership has drifted: downloads (low-res, high-res, category zip) and share
  exist **only** in Detail; rotate/flip exist in Grid, Detail and Fullscreen; Map has
  **only** previous/next; breadcrumb, thumbnail-size, margin and dim toggles appear in
  different combinations per view.
- Info sidebar: `src/_media/detail/Sidebar.tsx` — eight lazily-loaded cards (Comments,
  EXIF, Effects, Histogram, MiniMap, Metadata Editor, Category Teaser, Place Covers),
  several admin-gated. Wired into `ViewDetail` **only**. `ViewBulkEdit` has a second,
  unrelated sidebar (`src/_media/bulk-edit/BulkEditSidebar.tsx`).
- Which views an area offers varies: a category has all five; person/clan/place feeds have
  grid/detail/fullscreen plus a categories listing; random has three; below the `md`
  breakpoint everything except grid is hidden from the switcher.
- Media services implement `IMediaService` / `INavigable`; `getAvailableRoutes()` decides
  which view links appear.

### Listing surfaces re-implement each other

`src/categories/components/Toolbar{Grid,List}.tsx`, `src/search/components/Toolbar{Grid,List}.tsx`,
`src/_media/ToolbarGrid.tsx`, plus `src/people/components/Toolbar.tsx`,
`src/places/components/Toolbar.tsx`, `src/stats/components/Toolbar.tsx`,
`src/about/components/Toolbar.tsx` each hand-roll their own button list. Thumbnail size,
margins, dim-thumbnails, show-titles/breadcrumbs, favorites badge and media-type badge are
implemented separately in at least three places, bound to the same letters (`s`, `m`, `b`,
`t`, `h`, `e`) in each, and stored in separate contexts — so a preference set in one
listing does not follow you to the next.

### Settings are duplicated and partial

- Contexts in `src/_contexts/settings/`: `Media{Grid,Detail,Fullscreen,Map,Page}ViewSettings`,
  `MediaInfoPanelSettings`, `Category{Grid,List,Page,Filter}ViewSettings`,
  `Search{Grid,List,Page}ViewSettings`, `PeopleGridViewSettings`, `FaceFeedSettings`,
  `FeedCategoryViewSettings`, `AppSettings`. `highlightFaces` is defined in three of them,
  `showFavoritesBadge` in three, `thumbnailSize`/`dimThumbnails` in several.
- The settings area (`src/settings/`) has pages for Categories, Media, People and Search
  only — Places, Stats, Random and the app-level preferences have no home there. Each page
  mirrors toolbar toggles by hand, so the two can disagree.
- Settings persist to client storage (`src/_contexts/settings/_storage.ts`).

### Chrome, states and visual system

- `src/_components/layout/Layout.tsx` is the single page shell (toolbar / content /
  sidebar grid). Areas pass `title` _or_ `header`, toolbars, and optional sidebars.
- Navigation: `src/_components/primary-nav/` (collapsible rail: Categories, People,
  Places, Search, Random, Stats, then user, theme, About, Settings), breadcrumbs
  (`src/_components/categories/CategoryBreadcrumb.tsx`), the place chain
  (`src/places/components/PlaceChain.tsx`), and a `Redirect.tsx` per area.
- States: `src/_components/loading/` (`Loading`, `SkeletonGrid`, `SkeletonList`,
  `_imageReveal`), `ClanSkeleton`, `src/_components/error/` (`AppErrorBoundary`,
  `ErrorMessage`, `_queryError`), and ad-hoc empty states such as `EmptyClanMessage`.
- Inputs: `src/_components/input/` (`Checkbox`, `RadioGroup`, `Select`, `Toggle`).
  Dialogs are per-area and hand-built (`ClanNameDialog`, `ClanDeleteDialog`,
  `PlaceCoverDialog`, `PlaceMergeDialog`, `PlaceMoveDialog`, `ShortcutDialog`).
- Visual system: daisyUI semantic tokens with `src/_themes/{light,dark}.css`, plus custom
  utilities in `src/index.css` (`.stage-backdrop`, `.chrome-glass`, `.rise-in`,
  `.brand-in`, `.heart-pop`, `.skeleton-tile`, `.primary-nav-link`, `head1`/`head2`/`head3`).
  Type sizes are applied ad hoc at call sites (`text-sm` ~29 uses, `text-base` ~10,
  `text-xs` ~11, `text-lg` ~7, `text-xl` ~1). Icons mix two Iconify sets, `ic--` and `mdi--`.
- Shortcuts are registered per button via `shortcutKeys` and surfaced in
  `src/_components/shortcuts/ShortcutDialog.tsx`. The same letter means different things
  in different areas.
- Data layer is TanStack Query (`src/_contexts/api/`); auth is Auth0 with admin-gated
  surfaces (metadata editing, bulk edit, teaser and cover choosers, place administration).

## Goals

1. **Tools follow the content, not the view.** Anything meaningful for the focused item
   should be reachable wherever an item is focused — including the grid. Same affordance,
   same position, same shortcut, everywhere.
2. **One source of truth per preference.** A preference meaning the same thing in two
   places is stored once. Genuinely surface-specific settings (grid margins) stay local.
3. **One listing vocabulary.** Categories, search results, people, places and media should
   share one set of density/badge/label controls rather than five parallel copies.
4. **Fewer controls.** Actively propose removals and merges. A toggle that is rarely used,
   duplicates another, or exists only because it was cheap to add should go. Say so
   explicitly and let the owner veto.
5. **One visual system.** A defined type scale, spacing rhythm, elevation and icon
   vocabulary applied through shared components — not per-call-site utility strings. Light
   and dark themes both deliberate.
6. **Consistent states.** Loading, empty, error, offline, unauthorized and admin-only
   states should look and behave the same in every area.
7. **Coherent wayfinding.** Where am I, what's the way back, and what's deep-linkable
   should be answered the same way in every area, including on a phone.
8. **Accessible and responsive by default.** Keyboard reachability, visible focus, ARIA
   labeling on icon-only controls, contrast in both themes, reduced-motion respect, and a
   deliberate answer for small screens instead of hiding features below `md`.

## Constraints

- Preserve behavior users depend on: deep-linkable URLs per view and per item, keyboard
  shortcuts (renaming is fine if consistent and documented), admin gating, lazy loading of
  heavy sidebar cards and routes.
- Persisted settings must migrate or default gracefully — do not break a returning user's
  saved preferences.
- Match the surrounding code: SolidJS idioms (never destructure props; note the existing
  "resolve `children()` once" comments — reading a JSX prop twice double-registers
  shortcuts), daisyUI semantic color tokens over raw palette values, the repo's file
  layout and comment voice.
- `bun run typecheck`, `bun run lint` and `bun run test` must pass; run `bun run format`
  before finishing.
- Backend APIs are fixed; this is a client-side redesign.

## Deliverable — a plan, not code

Do not write implementation code. Produce a proposal containing:

1. **Inventory matrix.** Every tool, toggle, badge, panel and dialog against every view and
   area, showing where each exists today and which context backs it.
2. **Disposition per entry:** promote / merge / demote to settings / remove, each with a
   one-line rationale. Be opinionated about removals.
3. **Information architecture.** What belongs in the toolbar, in a contextual panel, in a
   per-item overflow menu, and in app settings — and how a contextual panel behaves in
   grid versus fullscreen where space differs.
4. **Shared component plan.** The listing surface, toolbar, panel, dialog, state (loading/
   empty/error) and input primitives that replace today's per-area copies, with which
   existing files collapse into each.
5. **Settings consolidation.** The target context shape, what merges, and how persisted
   state migrates.
6. **Visual system spec.** Type scale, spacing, radius/elevation, icon set choice, motion,
   and how the two themes are kept honest.
7. **Unified shortcut map** with no collisions across areas.
8. **Responsive and accessibility plan**, including what small screens get.
9. **Ordered implementation roadmap** of small, independently shippable steps, each leaving
   the app working and typechecking — sequenced so that shared primitives land before the
   areas that consume them.
10. **Open questions** where owner judgment is needed, especially proposed deletions.

Prefer a small number of strong recommendations over an exhaustive menu of options. Where
you are choosing between designs, state the trade-off in a sentence or two and pick one.
