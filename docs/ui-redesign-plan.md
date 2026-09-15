# maw-photos — coherence proposal

_A plan, not code. Everything below is checked against the working tree at `933eccb`._

---

## 0. Corrections to the brief's ground truth

The brief is accurate on structure and mostly accurate on counts. Six corrections, all of which make the problem slightly worse than stated:

1. **`showFavoritesBadge` is in six contexts, not three** — `MediaGridViewSettings`, `MediaDetailViewSettings`, `MediaFullscreenViewSettings`, `CategoryGridViewSettings`, `SearchGridViewSettings`, `FeedCategoryViewSettings`. `showTypesBadge` is in four. `thumbnailSize` and `dimThumbnails` are in **eight** each; `margin` in **seven**. `highlightFaces` in three, as stated.

2. **The listing-toolbar list is missing two files.** `src/_media/feed/ToolbarCategories.tsx` is a sixth full copy of the density/label/badge block (it carries `y`, `t`, `s`, `m`, `b`, `h`, `e`), and `src/_media/ToolbarDetail.tsx` carries a fifth copy of thumbnail-size + dim + favorites-badge. `src/settings/components/Toolbar.tsx` is a seventh hand-rolled nav row.

3. **Type-size counts are understated.** Actual: `text-sm` 37, `text-lg` 19, `text-base` 11, `text-xs` 11, `text-xl` 2, `text-4xl` 2, `text-3xl` 1 — plus **10 uses of `text-6`, which is not a Tailwind utility and emits no CSS** (verified against `dist/assets/index-B1bRn6Mj.css`: only `text-6xl` matches). So the icons in `ErrorMessage`, `InfoCard`, `SearchBar`, `PersonFilterBar`, `PlaceSearchBar`, `EmptyClanMessage` and `CategoryListItem` render at inherited size, not the intended one.

4. **Four more classes in the source produce no CSS at all:**
    - `.scrollable` — 5 uses (`Layout.tsx:42`, `MediaList.tsx:48`, `Sidebar.tsx:170`, `BulkEditSidebar.tsx:38`, `ShortcutDialog.tsx:64`), defined nowhere.
    - `mr[-1px]` in `ToolbarLink.tsx`'s `ACTIVE_CLASS` — missing hyphen, should be `mr-[-1px]`.
    - `border-l-base-content:30%` in `BulkEditSidebar.tsx:38` — should be `border-l-base-content/30`.
    - `flex-items-center` — 2 uses (`InfoCard.tsx:22`, `CategoryFilterBar.tsx:15`); not a utility.

5. **`AppSettingsState.isToolbarCollapsed` is inverted.** `ToolbarButton`, `ToolbarLink` and `ToolbarDownloadLink` all do `"md:inline": state.isToolbarCollapsed` — labels appear when the flag is _true_. `PrimaryNavLink` does the opposite (`showTitle={!state.isPrimaryNavCollapsed}`). The two collapse flags in one store mean opposite things. This matters for migration (§5).

6. **The icon situation is worse than "two sets".** Within `ic--` there are five style families in use: `round` (124), `outline` (8), `baseline` (4), bare (2), `sharp` (1), plus `mdi--` (36 uses / 17 unique). Six vocabularies, not two.

Also worth noting, though not a claim in the brief: **the codebase has 5 ARIA attributes total** (3 `aria-hidden`, 1 `aria-label`, 1 `aria-disabled`), **zero `:focus-visible` or `focus:` styling anywhere**, and **15 of 22 `<img>` elements have no `alt`**.

Everything else in the brief I verified as written: toolbar membership drift, `gteMd()` gating in `src/_media/Toolbar.tsx:69`, the eight lazy cards wired only into `ViewDetail`, `getAvailableRoutes()` driving the switcher, per-area `Redirect.tsx`, the motion primitives and the `prefers-reduced-motion` kill switch.

---

## 0.5 Decisions — 2026-09-11

The eight open questions in §10 were walked through with the owner. These answers are binding and **supersede §2, §5, §7 and §9 wherever they differ**.

| #   | Question                 | Decision                                                                                                                                                                              |
| --- | ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | Dim thumbnails           | **Keep the toggle.** Consolidated to one flag in `ListingSettings` and one button in `ListingToolbar`, but it stays user-controllable — it is not fixed tile behaviour.               |
| 2   | Margins + thumbnail size | **Merge into one Density control, three steps** (Comfortable / Compact / Dense). 16 combinations become 3; big-tiles-in-a-narrow-column is deliberately given up.                     |
| 3   | Breadcrumb toggles       | **Remove all three.** Always visible in grid, never in fullscreen.                                                                                                                    |
| 4   | Filmstrip                | **Delete the Detail view outright** — see below. The filmstrip goes with it.                                                                                                          |
| 5   | Badges                   | **One toggle, default ON.** Favourite hearts and media-type icons appear together and are visible out of the box. A visible change for every existing user.                           |
| 6   | Inspector card letters   | **Remove.** `i` opens the Inspector; arrow keys move between cards once the rail has focus. Eight letters returned.                                                                   |
| 7   | Category year filter     | **Keep persisting it** — §5's "belongs in the link" rule does _not_ apply here. Precedence rule below.                                                                                |
| 8   | Detail view              | **Delete**, with `/detail/*` redirecting to grid with the item active.                                                                                                                |
| 12  | About → Android page     | **Keep as-is.** It stays a route in the About nav row; it gets the same a11y treatment as everything else (the Play icon has no `alt`, and the external link needs `rel="noopener"`). |
| 13  | Theme                    | **Add `system`, and make it the default** for anyone without an explicit stored choice.                                                                                               |
| 14  | Visual effects lifetime  | **Unchanged — everything persists across moves.** Keep the eight per-control clear buttons _and_ add a single reset-all.                                                              |

### Deleting the Detail view

The evidence for this is stronger than §2 realised: **grid already renders the detail experience.** When an item is active, `ViewGrid.tsx:118-150` mounts the same `MainItem` component Detail uses, inside an overlay over the dimmed grid, with the same `CategoryBreadcrumb` above it. Detail adds exactly two things on top of that — the filmstrip (`MediaList.tsx`, whose only consumer is `ViewDetail`) and the Inspector, which §3 promotes into grid anyway.

Scope — deleted:

- `src/_media/ViewDetail.tsx`, `src/_media/ToolbarDetail.tsx`, `src/_media/MediaList.tsx`
- `src/category/Detail.tsx`, `src/random/Detail.tsx`, `src/_media/feed/Detail.tsx`
- `src/_contexts/settings/MediaDetailViewSettingsContext.tsx`
- `MediaViewDetail` from `src/_models/MediaView.ts` and `allMediaViews`
- the `detailRoute` entries in `src/category/_routes.ts`, `src/random/_routes.ts`, `src/_media/feed/_routes.ts`
- `getMediaPathByView(MediaViewDetail, …)` branches in `CategoryMediaService`, `RandomMediaService`, `FeedMediaService`

Consequences to handle:

1. **Redirects.** `/detail/:mediaSlug` → `/grid/:mediaSlug` in every area that had one; the slug maps 1:1, so a shared link lands on the same photograph. Keep the redirect indefinitely — these URLs are shareable and have been for years.
2. **Saved view migration.** `MediaPageSettings.view === "detail"` migrates to `"grid"` (§5's migration table gains this row).
3. **Navigation rows shorten.** Category media goes from five views to four (Grid, Fullscreen, Map, Bulk Edit); feeds go to Grid + Fullscreen. §7's digit table updates accordingly.
4. **Grid's overlay must host a docked Inspector.** Today it is `absolute z-30` sized from a `createElementSize` measurement of the grid area (`absoluteDivStyle()`). With an Inspector docked beside it, that measurement has to account for the panel's width or the photo will sit underneath it. This is the one piece of real layout work in the deletion.
5. **Ordering.** This lands _after_ step 9 (the Inspector reaching grid), never before — otherwise EXIF, comments and the histogram become unreachable in the interim.

### Theme: adding `system` (decision 13)

Today `index.html`'s pre-mount script pins `data-theme` to `dark` unless `"light"` is explicitly stored, while the `<meta name="theme-color">` tags in the same file already branch on `prefers-color-scheme` — so the browser chrome follows the OS while the app overrides it. `system` resolves that.

- `AppSettings.theme` becomes `"light" | "dark" | "system"`.
- The pre-mount script gains one branch: an explicit `"light"` or `"dark"` wins; anything else — absent, `"system"`, or the legacy `"dusk"` — resolves through `matchMedia("(prefers-color-scheme: dark)")`. It must stay inline and synchronous; this is the no-flash path.
- `ThemeWrapper` subscribes to `matchMedia` change events while in `system` mode, so a user flipping their OS theme sees the app follow without a reload.
- `toggleTheme` becomes a three-way cycle bound to `t` (§7), with an explicit Select on Settings → Appearance.
- **Migration:** an explicitly stored `"light"` or `"dark"` is preserved. Nothing stored, or the legacy `"dusk"`, becomes `"system"` — which is the accepted visible change: someone who never touched the toggle and runs a light-mode OS will see the app turn light on first load after the upgrade.

### Visual effects (decision 14)

The lifetime stays exactly as it is: `VisualEffectsProvider` remains at `MediaRoot`, so filters and transforms follow you across moves within a media area and clear when you leave it. §10's question is answered — this is intended, not an oversight.

What changes is only how you get _out_ of an effect:

- The eight per-control `EffectsResetButton` instances stay. Dragging a range slider back to its exact neutral point is tedious, and a per-control clear is the cheap fix for that — this is the reason the buttons exist and they are doing their job.
- Add **one reset-all** to the Adjust card. `VisualEffectsContext` already exports `reset()`, which restores `defaultVisualEffects` — including `rotation`, `flipHorizontal` and `flipVertical` — and nothing currently calls it. Wiring one button to it covers filters and transforms together, which matters more once rotate/flip move into the same card (§2).

### Year filter precedence (decision 7)

Keeping both a persisted year filter and `?year=` requires a stated rule, or the conflict §2 flagged simply survives:

- `?year=` present → it wins, and it updates the stored value.
- `?year=` absent → the stored value applies and is written into the URL on first render.
- "All years" is a real stored value, not an absence — so clearing the filter persists as cleared rather than falling back to a remembered year.

That keeps a shared link honest (the recipient sees the sender's year) while a fresh visit to Categories still restores where you left off.

---

## 1. Inventory matrix

Surfaces (columns) — file that renders each:

| #   | Code   | File                                                |
| --- | ------ | --------------------------------------------------- |
| 1   | CAT-G  | `src/categories/Grid.tsx`                           |
| 2   | CAT-L  | `src/categories/List.tsx`                           |
| 3   | SRCH-G | `src/search/Grid.tsx`                               |
| 4   | SRCH-L | `src/search/List.tsx`                               |
| 5   | PPL    | `src/people/Grid.tsx`                               |
| 6   | PLC    | `src/places/Browse.tsx`                             |
| 7   | FEED-C | `src/_media/feed/Categories.tsx`                    |
| 8   | M-G    | `src/_media/ViewGrid.tsx`                           |
| 9   | M-D    | `src/_media/ViewDetail.tsx`                         |
| 10  | M-F    | `src/_media/ViewFullscreen.tsx`                     |
| 11  | M-M    | `src/_media/ViewMap.tsx`                            |
| 12  | M-B    | `src/_media/ViewBulkEdit.tsx`                       |
| 13  | STAT   | `src/stats/{Summary,Year}.tsx`                      |
| 14  | ABT    | `src/about/Layout.tsx`                              |
| 15  | SET    | `src/settings/{Categories,Media,People,Search}.tsx` |

### 1a. Toolbar controls

`•` = present. `(k)` = key. Context column names the store it writes to.

| Control                   | 1      | 2      | 3      | 4      | 5        | 6      | 7    | 8            | 9   | 10  | 11  | 12  | 13  | 14   | 15   | Backed by                                                |
| ------------------------- | ------ | ------ | ------ | ------ | -------- | ------ | ---- | ------------ | --- | --- | --- | --- | --- | ---- | ---- | -------------------------------------------------------- |
| View/listing links        | •(g,l) | •(g,l) | •(g,l) | •(g,l) | –        | •(p,k) | •(k) | •(g,w,f,z,/) | •   | •   | •   | •   | –   | •(3) | •(4) | `Category/Search/MediaPageSettings` + `FaceFeedSettings` |
| Request more `r`          | –      | –      | •      | •      | –        | –      | •    | •            | •   | •   | –   | –   | –   | –    | –    | none (query)                                             |
| Slideshow `p`             | –      | –      | –      | –      | –        | –      | –    | •            | •   | •   | –   | –   | –   | –    | –    | `MediaPageSettings.slideshowDisplayDurationSeconds`      |
| Prev/Next `←/→`           | –      | –      | –      | –      | –        | –      | –    | •¹           | •   | •   | •   | –   | –   | –    | –    | none                                                     |
| Rotate CW/CCW `d/a`       | –      | –      | –      | –      | –        | –      | –    | •¹           | •   | •   | –   | –   | –   | –    | –    | `VisualEffectsContext`                                   |
| Flip H/V                  | –      | –      | –      | –      | –        | –      | –    | •¹           | •   | •   | –   | –   | –   | –    | –    | `VisualEffectsContext`                                   |
| Download low-res          | –      | –      | –      | –      | –        | –      | –    | –            | •   | –   | –   | –   | –   | –    | –    | none                                                     |
| Download high-res         | –      | –      | –      | –      | –        | –      | –    | –            | •   | –   | –   | –   | –   | –    | –    | none                                                     |
| Download category zip     | –      | –      | –      | –      | –        | –      | –    | –            | •²  | –   | –   | –   | –   | –    | –    | none                                                     |
| Share                     | –      | –      | –      | –      | –        | –      | –    | –            | •³  | –   | –   | –   | –   | –    | –    | none                                                     |
| Highlight faces `q`       | –      | –      | –      | –      | –        | –      | –    | •            | •   | •   | –   | –   | –   | –    | –    | 3 contexts: Media{Grid,Detail,Fullscreen}                |
| Favorites badge `h`       | •      | –      | •      | –      | –        | –      | •    | •            | •   | •   | –   | –   | –   | –    | –    | **6 contexts**                                           |
| Media-type badge `e`      | •      | –      | •      | –      | –        | –      | •    | •            | –   | –   | –   | –   | –   | –    | –    | **4 contexts**                                           |
| Titles / Names `t`        | •      | –      | •      | –      | •(Names) | –      | •    | –            | –   | –   | –   | –   | –   | –    | –    | Category/Search/FeedCategory/PeopleGrid                  |
| Years `y`                 | –      | –      | •      | –      | –        | –      | •    | –            | –   | –   | –   | –   | –   | –    | –    | Search/FeedCategory                                      |
| Media counts `c`          | –      | –      | –      | –      | •        | –      | –    | –            | –   | –   | –   | –   | –   | –    | –    | `PeopleGridViewSettings`                                 |
| Thumbnail size `s`        | •      | •      | •      | •      | •        | –      | •    | •            | •   | –   | –   | –   | –   | –    | –    | **8 contexts**                                           |
| Margins `m`               | •      | •      | •      | •      | •        | –      | •    | •            | –   | –   | –   | –   | –   | –    | –    | **7 contexts**                                           |
| Dim thumbnails `b`        | •      | •      | •      | •      | •        | –      | •    | •            | •   | –   | –   | –   | –   | –    | –    | **8 contexts**                                           |
| Breadcrumbs `t`           | –      | –      | –      | –      | –        | –      | –    | •⁴           | •   | –   | –   | –   | –   | –    | –    | MediaGrid(×2), MediaDetail                               |
| Filmstrip `l`             | –      | –      | –      | –      | –        | –      | –    | –            | •   | –   | –   | –   | –   | –    | –    | `MediaDetailViewSettings.showMediaList`                  |
| Sort `o`                  | –      | –      | –      | –      | •        | –      | –    | –            | –   | –   | –   | –   | –   | –    | –    | `PeopleGridViewSettings.sortBy`                          |
| Favorites-only filter `u` | –      | –      | –      | –      | –        | –      | •    | •⁵           | •⁵  | •⁵  | –   | –   | –   | –    | –    | URL `?f`                                                 |
| Shuffle `j`               | –      | –      | –      | –      | –        | –      | –    | •⁵           | •⁵  | •⁵  | –   | –   | –   | –    | –    | URL seed                                                 |
| Year filter               | •      | •      | –      | –      | –        | –      | –    | –            | –   | –   | –   | –   | –   | –    | –    | `CategoryFilterSettings` **and** URL `?year`             |
| Missing-GPS filter        | •⁶     | •⁶     | –      | –      | –        | –      | –    | –            | –   | –   | –   | –   | –   | –    | –    | `CategoryFilterSettings`                                 |
| Text search / filter      | –      | –      | •      | •      | •        | •      | –    | –            | –   | –   | –   | –   | –   | –    | –    | `SearchContext` / local signal / URL `?q`                |
| Place kind filter         | –      | –      | –      | –      | –        | •      | –    | –            | –   | –   | –   | –   | –   | –    | –    | URL `?kind`                                              |
| Edit mode `e`             | –      | –      | –      | –      | –        | •⁶     | –    | –            | –   | –   | –   | –   | –   | –    | –    | URL `?edit`                                              |
| Cover/Move/Merge `c,m,g`  | –      | –      | –      | –      | –        | •⁶     | –    | –            | –   | –   | –   | –   | –   | –    | –    | dialogs                                                  |
| Stats type/mode           | –      | –      | –      | –      | –        | –      | –    | –            | –   | –   | –   | –   | •   | –    | –    | URL                                                      |
| Toolbar collapse          | •      | •      | •      | •      | •        | •      | •    | •            | •   | •   | •   | •   | •   | •    | •    | `AppSettings.isToolbarCollapsed` (inverted)              |

¹ only when `activeMedia` is set; prev/next additionally gated on `!ltMd()`. ² only when `enableCategoryDownload` (category feeds only). ³ only when `navigator.canShare()`. ⁴ two separate toggles, both on `t`, mutually exclusive by `activeMedia`. ⁵ feed surfaces only, via `toolbarExtras`. ⁶ admin only.

### 1b. Panels, cards, dialogs, states

| Item                                                        | Where today                                                                                                                 | Backed by                                       |
| ----------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------- |
| Info sidebar (rail + 500px panel)                           | **M-D only**                                                                                                                | `MediaInfoPanelSettings.expandInfoPanel`        |
| Comments `c`                                                | M-D                                                                                                                         | `.showComments`                                 |
| EXIF `x`                                                    | M-D                                                                                                                         | `.showExif`                                     |
| Effects `e`                                                 | M-D                                                                                                                         | `.showEffects` + `VisualEffectsContext`         |
| Histogram `o`                                               | M-D                                                                                                                         | `.showHistogram`                                |
| MiniMap `v`                                                 | M-D                                                                                                                         | `.showMinimap` + `.minimapZoom/.minimapMapType` |
| Metadata editor `n` (admin)                                 | M-D                                                                                                                         | `.showMetadataEditor`                           |
| Category teaser `k` (admin)                                 | M-D                                                                                                                         | `.showCategoryTeaserChooser`                    |
| Place covers `y` (admin)                                    | M-D                                                                                                                         | `.showPlaceCovers`                              |
| Bulk-edit sidebar (2 cards)                                 | M-B                                                                                                                         | none — a second, unrelated panel                |
| `ClanNameDialog` / `ClanDeleteDialog`                       | PPL                                                                                                                         | local signals                                   |
| `PlaceCoverDialog` / `PlaceMergeDialog` / `PlaceMoveDialog` | PLC                                                                                                                         | local signals                                   |
| `ShortcutDialog`                                            | global (`App.tsx`)                                                                                                          | `ShortcutContext`                               |
| Loading                                                     | `SkeletonGrid` (1,3*,5,6,8,12), `SkeletonList` (2,4*), `ClanSkeleton` (5), `Loading` spinner (13), **nothing at all** (3,4) | —                                               |
| Empty                                                       | `EmptyClanMessage`, 5 inline `<p class="text-center my-8">` variants, 1 italic `<div>` in `ViewMap`                         | —                                               |
| Error                                                       | `ErrorMessage` (consistent), `AppErrorBoundary` ×2                                                                          | `_queryError`                                   |
| Unauthorized                                                | `AuthGuard` renders nothing and redirects                                                                                   | —                                               |
| Inactive account                                            | `src/auth/Inactive.tsx` (bespoke page)                                                                                      | —                                               |
| Admin-only                                                  | `AdminGuard` navigates away silently; elsewhere buttons are simply absent                                                   | —                                               |

\* `search/Grid.tsx` and `search/List.tsx` render **no** loading state — the results area is blank while the query is in flight.

---

## 2. Disposition

### Remove (I am recommending deletion, not offering it)

| Entry                                                                                                                                                            | Disposition                                                         | Rationale                                                                                                                                                                                                                               |
| ---------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Dim thumbnails** (8 contexts, 8 buttons)                                                                                                                       | ~~Remove~~ → **KEPT** (decision 1)                                  | Consolidates to one flag and one button, but stays a user control. Note for implementation: the button lights when the setting is _false_ (`active={!settings.dimThumbnails}`) — straighten that out when it moves to `ListingToolbar`. |
| **Margins** (7 contexts)                                                                                                                                         | **Remove as a control**                                             | `mx-[0/8/16/24%]` is a percentage gutter masquerading as density. Replaced by a stage max-width; the remaining user-facing knob is Density.                                                                                             |
| **Thumbnail size** (8 contexts)                                                                                                                                  | **Merge into Density**                                              | 4 sizes × 4 margins = 16 ways to express one idea. Three named steps (Comfortable / Compact / Dense).                                                                                                                                   |
| **Show titles / years / names / counts** (4 controls, 4 contexts)                                                                                                | **Merge into "Labels"**                                             | All four answer "do I want text under the picture". One toggle, one key.                                                                                                                                                                |
| **Title↔thumbnail-size coupling** (`ToolbarGrid.tsx:26-34`, `search/ToolbarGrid.tsx:36-50`, `feed/ToolbarCategories.tsx:41-62`, `settings/Categories.tsx:43-60`) | **Remove**                                                          | Four copies of "turning titles on forces the largest thumbnail, and the size button goes disabled". It exists because the tile doesn't reserve label space. Fix the tile; delete the rule.                                              |
| **Favorites badge / media-type badge** toggles                                                                                                                   | **Merge into "Badges", default ON**                                 | Both default `false` today, which means the heart — the only way to favourite media — is invisible until you discover a toolbar button. That is a bug wearing a preference's clothes.                                                   |
| **Breadcrumb toggles** (3 of them, all `t`)                                                                                                                      | **Remove**                                                          | ~24px of text that answers "where am I". Always on in grid/detail, never in fullscreen. Deletes `showBreadcrumbs`, `showMainBreadcrumbs`, and four props threaded through `ViewGrid`.                                                   |
| **Filmstrip toggle** `l`                                                                                                                                         | ~~Remove the toggle~~ → **filmstrip deleted entirely** (decision 4) | `MediaList.tsx` has one consumer, `ViewDetail`, which is itself being deleted. The grid is the navigator.                                                                                                                               |
| **Toolbar collapse button** (every toolbar)                                                                                                                      | **Demote to Settings → Appearance**                                 | A chrome preference, not a tool; it occupies a permanent slot in fifteen toolbars. Fix the inverted flag name while moving it.                                                                                                          |
| **`MediaInfoPanelSettings.minimapZoom` / `.minimapMapType`**                                                                                                     | **Merge into map settings**                                         | Two stored preferences for the same Google map.                                                                                                                                                                                         |
| **`MediaFullscreenViewSettingsContext`** (whole file)                                                                                                            | **Remove**                                                          | Its two fields are the global `highlightFaces` and the global badge setting.                                                                                                                                                            |
| **`CategoryFilterSettings.yearFilter` persistence**                                                                                                              | ~~Remove~~ → **KEPT** (decision 7)                                  | Both sources stay; §0.5 defines the precedence rule that stops them disagreeing.                                                                                                                                                        |
| **`.scrollable`, `.text-6`, `flex-items-center`, `mr[-1px]`, `border-l-base-content:30%`**                                                                       | **Delete / fix**                                                    | Emit no CSS. Verified against the built stylesheet.                                                                                                                                                                                     |
| **`@iconify-json/mdi`**                                                                                                                                          | **Remove the dependency**                                           | Every one of the 17 mdi icons has an `ic--round-*` equivalent.                                                                                                                                                                          |
| **`Select.horizontal` prop** and hardcoded `name="theme"`                                                                                                        | **Remove**                                                          | Prop is accepted and never read; the `name` is a leftover.                                                                                                                                                                              |
| **`Toggle.tsx` / `Checkbox.tsx`**                                                                                                                                | **Merge into one `Switch`**                                         | `Toggle` renders a `<label>` with no text and a `head3` above it; `Checkbox` renders the same control with the text inside. Both files also export a component _named_ `Select`.                                                        |
| **`ClanDeleteDialog.tsx`**                                                                                                                                       | **Delete**                                                          | Becomes `<ConfirmDialog>` with three props.                                                                                                                                                                                             |
| **8 sidebar-card letter shortcuts** (`c,x,e,o,v,n,k,y`)                                                                                                          | **Remove as global keys**                                           | Trade-off below.                                                                                                                                                                                                                        |

**The one contentious removal.** Eight single letters are currently bound to "open card N of the sidebar" — and four of them (`c`, `e`, `o`, `y`) collide with other meanings elsewhere in the app. The alternative is to keep them and accept that `e` means _media-type badge_ in six toolbars, _Effects card_ in the sidebar, and _edit mode_ in Places. I recommend removing them: `i` opens the Inspector, and the card rail gets a roving-tabindex so arrow keys move between cards once it has focus. Keyboard operability is preserved; eight letters come back; no collisions remain. If the owner vetoes this, the fallback is `Shift+`-prefixed card keys, which is worse to type but keeps one-press access.

### Promote

| Entry                                                  | To                                                          | Rationale                                                                                                                                                                             |
| ------------------------------------------------------ | ----------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Inspector (all 8 cards)**                            | M-G, M-D, M-F, M-M, M-B — and PLC for the Place Covers card | This _is_ the core complaint. The grid already tracks a focused item (`getActiveMedia()` renders the enlarged preview in `ViewGrid.tsx:118-150`); the Inspector reads the same focus. |
| **Download low-res / high-res / category zip / Share** | Item overflow (`⋮`) on any surface with a focused item      | They act on an item, so they follow the item, not the view.                                                                                                                           |
| **Favorite**                                           | `h`, everywhere, acting on the focused item                 | Today `h` toggles _whether the heart is drawn_. Rebind it to _press the heart_.                                                                                                       |
| **Prev / Next**                                        | M-G on phones too, and M-M                                  | Currently `ViewGrid` hides them below `md` and `ViewMap` is the only view with nothing else.                                                                                          |
| **Slideshow**                                          | M-M                                                         | A slideshow that pans the map is the map's best feature and costs nothing.                                                                                                            |
| **Rotate / flip**                                      | Inspector "Adjust" card + `[` `]` `\`                       | Removes 4 buttons × 3 toolbars = 12 toolbar slots.                                                                                                                                    |

### Merge

| From                                                                                                                                                                                                                             | To                                                                                  |
| -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------- |
| `categories/ToolbarGrid`, `categories/ToolbarList`, `search/ToolbarGrid`, `search/ToolbarList`, `people/Toolbar`, `feed/ToolbarCategories`, the density half of `_media/ToolbarGrid`, the density half of `_media/ToolbarDetail` | **one** `listing/ListingToolbar.tsx`                                                |
| `_media/Toolbar` link block, `categories/Toolbar`, `search/Toolbar`, `about/Toolbar`, `settings/Toolbar`, `feed/ToolbarListing`, the listing pair in `places/Toolbar`                                                            | **one** `toolbar/NavGroup.tsx`                                                      |
| `_media/Toolbar{Grid,Detail,Fullscreen,Map}`                                                                                                                                                                                     | **one** `_media/MediaToolbar.tsx`, driven by a capability list from `IMediaService` |
| `search/SearchBar`, `people/PersonFilterBar`, `places/PlaceSearchBar`                                                                                                                                                            | **one** `input/TextFilter.tsx`                                                      |
| `ClanNameDialog`, `ClanDeleteDialog`, `PlaceCoverDialog`, `PlaceMergeDialog`, `PlaceMoveDialog`, `ShortcutDialog`                                                                                                                | `overlay/Dialog.tsx` + `overlay/ConfirmDialog.tsx` as the shells                    |
| `detail/Sidebar`, `bulk-edit/BulkEditSidebar`, `sidebar/SidebarLayout`, `sidebar/SidebarButton`, `sidebar/InfoCard`                                                                                                              | `inspector/*`                                                                       |
| `MediaGrid`, `YearGrid`, and the four inline `flex gap-2 flex-wrap place-content-center` blocks in `search/Grid`, `people/Grid`, `places/Browse`, `ViewBulkEdit`                                                                 | `listing/ListingSurface.tsx`                                                        |
| `CategoryCard`, `MediaLink`, `PersonCard`, `PlaceCard`                                                                                                                                                                           | `listing/Tile.tsx` + four thin entity adapters                                      |
| 16 settings-context files / 16 storage keys                                                                                                                                                                                      | 4 contexts, 4 keys                                                                  |

### Demote to settings

Slideshow duration (already there), map type + zoom, toolbar labels, theme (and add a `system` option — today `AppSettings.theme` is a two-way toggle with no system follow), default Inspector cards, default Density/Labels/Badges. These remain adjustable from the toolbar where they're live-adjustable, but via the same store — see §5.

---

## 3. Information architecture

**One rule, four homes.**

| Home                                              | Contains                                                                                                                                                                                                                 | Cap |
| ------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | --- |
| **Navigation row** (leading group of the toolbar) | Where you can go from here: listings, views, sections. Keyed `1`–`9` by position.                                                                                                                                        | 5   |
| **Toolbar** (after the divider)                   | Verbs that change _what_ you're looking at (filter, shuffle, more, sort) or _how the whole listing_ looks (density, labels, badges, faces).                                                                              | 9   |
| **Inspector** (right panel)                       | Everything _about_ the focused item, and anything needing more than an icon's worth of input: comments, EXIF, histogram, minimap, adjust (rotate/flip/filters), metadata editor, teaser chooser, place covers, bulk GPS. | —   |
| **Item overflow `⋮`**                             | Verbs acting on exactly one item, used rarely: download low/high, share, copy deep link, set as category teaser, set as place cover. On the tile (hover/focus) and mirrored in the toolbar when an item is focused.      | 6   |
| **Settings**                                      | Defaults and set-once preferences: theme, toolbar labels, slideshow duration, map type/zoom, default inspector cards, default density.                                                                                   | —   |

**Focused item.** Every listing surface exposes `focusedItem()`. In a grid it is the item under the keyboard cursor, or the last clicked, and it is already modelled — `IMediaService.getActiveMedia()`. In Detail/Fullscreen it is the item on screen. In Map it is the selected marker. In Bulk Edit it is the _selection_, and the Inspector shows the two bulk cards instead of the per-item ones. Listings that don't track focus (Categories, People, Places) get it for free from the same `ListingSurface` keyboard cursor — which is also how those surfaces become keyboard-navigable for the first time.

**The Inspector across space.** One component, three presentations, chosen by breakpoint and view — not by area:

- **Docked** (`≥lg`): a right-hand column, `w-[420px] xl:w-[500px]`. Content reflows. This is today's Detail behaviour, generalised.
- **Overlay** (`md`–`lg`, and always in **Fullscreen**): floats over the right edge with a left-side scrim gradient, so the photograph keeps the full stage. In Fullscreen, the toolbar and Inspector rail auto-hide after 2.5s idle and return on pointer or key movement — which also fixes the fact that Fullscreen currently has permanent chrome.
- **Sheet** (`<md`): a bottom sheet at `70dvh` with a grab handle, one card at a time, swipe to dismiss. `w-[500px]` on a 390px phone is the reason the Inspector could never be promoted before.

**Card applicability.** Each card declares `appliesTo(ctx)`, where `ctx` carries `{ surface, item, category, isAdmin }`. The rail shows only applicable cards; a card the user had open on a surface where it doesn't apply is remembered but hidden. This is how one persisted card list works across five surfaces. Concretely: MiniMap is suppressed on M-M (it would duplicate the stage), Histogram is suppressed when there is no `mediaElement`, the bulk cards appear only on M-B, Category Teaser keeps its existing `enableCategoryTeaser` gate, and the three admin cards keep their `isAdmin` gate.

**Small-screen answer, stated plainly.** Below `md` the toolbar becomes a bottom bar with the navigation row as a segmented control plus four toolbar verbs plus `⋮`; everything else moves into the overflow sheet. Nothing is hidden — `src/_media/Toolbar.tsx:69`'s `<Show when={gteMd()}>` around Detail / Fullscreen / Map / Bulk Edit goes away. The one deliberate exception is **Bulk Edit, which stays `md`+ and admin-only**: it is a multi-select over a hundred tiles with a GPS form, and a phone-shaped version of it would be a worse tool, not a smaller one.

---

## 4. Shared component plan

New tree under `src/_components/`. Each row names exactly what collapses into it.

```
_components/
  listing/
    ListingSurface.tsx   grid|list container, keyboard cursor, entrance animation, empty slot
    Tile.tsx             image + reveal + dim + hover elevation + 4 badge corners + overflow slot
    Row.tsx              list-shaped counterpart
    ListingToolbar.tsx   density / labels / badges / faces / sort, from the preference registry
    ItemActions.tsx      the ⋮ menu
    SelectionBar.tsx     (moved from people/)
  toolbar/
    ToolbarLayout.tsx    (keep; add role="toolbar" + roving tabindex + bottom-bar variant)
    NavGroup.tsx         the digit-keyed navigation row
    ToolbarButton.tsx    (keep; add required label, aria-pressed)
    ToolbarLink.tsx      (keep; add aria-current; fix mr[-1px])
    ToolbarOverflow.tsx  small-screen sheet
  inspector/
    Inspector.tsx        rail + panel, docked|overlay|sheet
    InspectorCard.tsx    (was sidebar/InfoCard)
    registry.ts          card descriptors with appliesTo() + lazy component
  overlay/
    Dialog.tsx           <dialog class="modal"> + open effect + title + actions + pending/error
    ConfirmDialog.tsx
  state/
    AsyncBoundary.tsx    query[] → skeleton | ErrorState | EmptyState | children
    SkeletonGrid.tsx     (keep)  SkeletonList.tsx (keep)  SkeletonChart.tsx (new, for stats)
    EmptyState.tsx       icon + headline + sentence + optional action
    ErrorState.tsx       (was error/ErrorMessage)
    PermissionState.tsx  unauthorized / inactive / admin-only
  input/
    Switch.tsx           (Toggle + Checkbox merged)
    RadioGroup.tsx       (keep; fix generic export name)
    Select.tsx           (keep; drop `horizontal`, drop name="theme")
    TextFilter.tsx       input + submit + clear, one keyboard contract
    SegmentedControl.tsx stats type/mode, places kind, settings radio rows
```

**Collapse map — files deleted:**

| Deleted                                                                                                                                                                   | Replaced by                               |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------- |
| `categories/components/ToolbarGrid.tsx`, `ToolbarList.tsx`                                                                                                                | `listing/ListingToolbar`                  |
| `search/components/ToolbarGrid.tsx`, `ToolbarList.tsx`                                                                                                                    | `listing/ListingToolbar`                  |
| `people/components/Toolbar.tsx`                                                                                                                                           | `listing/ListingToolbar` + `NavGroup`     |
| `_media/feed/ToolbarCategories.tsx`                                                                                                                                       | `listing/ListingToolbar` + `NavGroup`     |
| `_media/ToolbarGrid.tsx`, `ToolbarDetail.tsx`, `ToolbarFullscreen.tsx`, `ToolbarMap.tsx`                                                                                  | `_media/MediaToolbar.tsx`                 |
| `_media/toolbar/ToggleShowFavoritesButton.tsx`, `ToggleShowTypesButton.tsx`                                                                                               | one Badges button in `ListingToolbar`     |
| `_media/toolbar/Rotate{Clockwise,CounterClockwise}Button.tsx`, `Flip{Horizontal,Vertical}Button.tsx`                                                                      | Inspector _Adjust_ card + `[` `]` `\`     |
| `_media/detail/Sidebar.tsx`, `_media/bulk-edit/BulkEditSidebar.tsx`                                                                                                       | `inspector/Inspector.tsx` + `registry.ts` |
| `_components/sidebar/{SidebarLayout,SidebarButton,InfoCard}.tsx`                                                                                                          | `inspector/*`                             |
| `categories/components/Toolbar.tsx`, `search/components/Toolbar.tsx`, `about/components/Toolbar.tsx`, `settings/components/Toolbar.tsx`, `_media/feed/ToolbarListing.tsx` | `toolbar/NavGroup.tsx`                    |
| `search/components/SearchBar.tsx`, `people/components/PersonFilterBar.tsx`                                                                                                | `input/TextFilter.tsx`                    |
| `people/components/ClanDeleteDialog.tsx`                                                                                                                                  | `overlay/ConfirmDialog.tsx`               |
| `_media/feed/EmptyClanMessage.tsx`                                                                                                                                        | `state/EmptyState.tsx`                    |
| `_components/input/Toggle.tsx`                                                                                                                                            | `input/Switch.tsx`                        |
| 11 of 16 settings context files                                                                                                                                           | §5                                        |

**`Tile.tsx` is worth being specific about.** `CategoryCard`, `MediaLink`, `PersonCard` and `PlaceCard` each independently re-implement: the `hasRevealed`/`markRevealed` fade-in with the `onMount(() => img.complete && reveal())` guard, the `saturate-50` / `group-hover:saturate-100` dim, the same 4-line hover elevation string, and a 2×2 grid with badges pinned to corners. That is ~90 duplicated lines × 4. `Tile` owns all of it and takes `{ href, src, alt, width, height, aspect, labels, badges, actions, selected, eager }`; the four entity cards become 25-line adapters.

**`AsyncBoundary` is the second-biggest deletion.** The `<Switch fallback={<Skeleton/>}><Match when={isError}><ErrorMessage/></Match><Match when={isSuccess}>…` triad appears in `categories/Grid`, `categories/List`, `search/Grid`_, `search/List`_, `people/Grid`, `places/Browse`, `category/{Grid,Detail,Fullscreen,Map,BulkEdit}`, `random/{Grid,Detail,Fullscreen}`, `_media/feed/{Grid,Detail,Fullscreen,Categories}` — about fifteen copies, two of which (`search/*`) forgot the loading branch entirely. `AsyncBoundary` takes the query array, calls `findQueryError`/`refetchQueries` from `_components/error/_queryError.ts` (which already exists and is good), and renders the right state. It makes "loading, empty, error look the same everywhere" a property of the type system rather than of diligence.

---

## 5. Settings consolidation

### Target shape — four contexts, four keys

```
maw-photos|v2|app        AppSettings
maw-photos|v2|listing    ListingSettings   ← one source of truth for all listing chrome
maw-photos|v2|media      MediaSettings     ← one source of truth for looking at an item
maw-photos|v2|area       AreaSettings      ← per-area "where was I"
```

```ts
interface AppSettings {
    theme: "light" | "dark" | "system"; // "system" is new
    navExpanded: boolean; // was !isPrimaryNavCollapsed
    toolbarLabels: boolean; // renamed to showToolbarLabels in step 0; read that key
}

interface ListingSettings {
    // applies to every listing, everywhere
    density: "comfortable" | "compact" | "dense";
    showLabels: boolean; // titles / years / names / counts
    showBadges: boolean; // favourites + media type
    highlightFaces: boolean;
    peopleSort: PersonSortIdType; // the one genuinely per-entity ordering
}

interface MediaSettings {
    view: MediaView;
    slideshowSeconds: number;
    showFilmstrip: boolean; // md+ only; auto-off below
    mapType: MapTypeIdType;
    mapZoom: MapZoomLevelIdType; // one map preference, used by the map view AND the minimap card
    inspectorOpen: boolean;
    inspectorCards: CardId[]; // ordered; replaces 8 booleans
}

interface AreaSettings {
    categoriesView: "grid" | "list";
    searchView: "grid" | "list";
    feedListing: "media" | "categories";
    categoryYearFilter: number | "all"; // kept by decision 7; URL wins when present (§0.5)
}
```

Everything else moves to the URL, where it already half-lives: category year filter and missing-GPS filter (`?year`, `?gps`), feed favourites-only and shuffle seed (already URL), place search / kind / edit mode (already URL), stats type and mode (already URL). **A preference that changes what a link shows belongs in the link.**

Contexts deleted: `MediaGridViewSettings`, `MediaDetailViewSettings`, `MediaFullscreenViewSettings`, `MediaMapViewSettings`, `MediaInfoPanelSettings`, `CategoryGridViewSettings`, `CategoryListViewSettings`, `CategoryPageSettings`, `CategoryFilterSettings`, `SearchGridViewSettings`, `SearchListViewSettings`, `SearchPageSettings`, `PeopleGridViewSettings`, `FeedCategoryViewSettings`, `FaceFeedSettings` — fifteen files, plus `AllSettingsProvider`'s eighteen-deep nesting becomes four.

### The preference registry — why the settings page can no longer disagree with the toolbar

The brief's "each page mirrors toolbar toggles by hand, so the two can disagree" is not fixed by consolidating stores; it is fixed by consolidating _descriptors_.

```ts
// src/_contexts/settings/registry.ts
export const preferences = {
    density:  { label: "Density",  icon: "…", key: "d",
                control: "cycle", options: densityOptions,
                get: () => listing.density, set: setDensity },
    showLabels: { label: "Labels", icon: "…", key: "l", control: "switch", … },
    …
} as const;
```

- `ListingToolbar` maps over a subset and renders `ToolbarButton`s.
- `settings/*` maps over the same entries and renders `Switch` / `RadioGroup` / `Select`.
- `ShortcutDialog` and the new Settings → Shortcuts page read `key` from the same place.

Three surfaces, one declaration. Adding a preference means adding one object.

### Settings area pages

Today: Categories, Media, People, Search — with Places, Stats, Random and the app-level preferences having no home. Target:

| Page           | Contents                                                                                                    |
| -------------- | ----------------------------------------------------------------------------------------------------------- |
| **Appearance** | Theme (light/dark/system), navigation rail expanded, toolbar labels, motion (respects OS, with an override) |
| **Browsing**   | Density, labels, badges, face highlighting, people sort — the whole `ListingSettings`                       |
| **Media**      | Default view, slideshow duration, filmstrip, map type/zoom, default Inspector cards                         |
| **Shortcuts**  | The full map, generated from the registry; the `?` dialog renders the same data                             |

Places, Stats and Random need no page because their state is now entirely in the URL. `src/settings/Categories.tsx`, `Media.tsx`, `People.tsx`, `Search.tsx` are deleted and regenerated from the registry.

### Migration

`src/_contexts/settings/_migrate.ts`, run once on first load, guarded by `maw-photos|v2|migrated`. It **reads the old keys and does not delete them**, so a rollback to the previous build finds a returning user's preferences intact.

| New value                      | Derived from                                                                                                                                                                       |
| ------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `theme`, `navExpanded`         | `\|app` (`theme`, `!isPrimaryNavCollapsed`)                                                                                                                                        |
| `toolbarLabels`                | `\|app.showToolbarLabels`, falling back to the legacy `\|app.isToolbarCollapsed` — step 0 already renamed it in place and carries the old value across, so this is a straight read |
| `density`                      | `\|mediagridview.thumbnailSize` → `default`→comfortable, `small`→compact, `verySmall`/`tiny`→dense; falls back to `\|categorygridview.thumbnailSize`, then the default             |
| `showLabels`                   | `categorygridview.showTitles \|\| searchgridview.showTitles \|\| peoplegridview.showNames`                                                                                         |
| `showBadges`                   | `OR` of the six `showFavoritesBadge` flags **OR** the four `showTypesBadge` flags                                                                                                  |
| `highlightFaces`               | `OR` of the three                                                                                                                                                                  |
| `peopleSort`                   | `\|peoplegridview.sortBy`                                                                                                                                                          |
| `view`, `slideshowSeconds`     | `\|mediapage`                                                                                                                                                                      |
| `showFilmstrip`                | `\|mediadetailview.showMediaList`                                                                                                                                                  |
| `mapType`, `mapZoom`           | `\|mediamapview`; ignore the minimap duplicates                                                                                                                                    |
| `inspectorOpen`                | `\|mediainfopanel.expandInfoPanel`                                                                                                                                                 |
| `inspectorCards`               | the eight `show*` booleans, mapped to ids, in the order the current `cards` array in `Sidebar.tsx` declares them                                                                   |
| `categoriesView`, `searchView` | `\|categorypage.viewMode`, `\|searchpage.viewMode`                                                                                                                                 |
| `feedListing`                  | `\|facefeed.showCategories ? "categories" : "media"`                                                                                                                               |

Two migration decisions worth naming: **`showBadges` migrates as an OR, not an AND** — anyone who had _any_ badge on anywhere keeps badges; anyone who had none gets the new default, which is on. And `dimThumbnails` is simply dropped; a user who had it off will see slightly less saturated idle thumbnails and identical hover behaviour.

Migration gets a `_migrate.test.ts` with fixtures for: empty storage, a full v1 storage, a partial v1 storage, the legacy `theme: "dusk"` case that `AppSettingsContext.loadState()` already handles, and corrupt JSON (which `loadJson` already swallows).

---

## 6. Visual system spec

### Type scale — five steps, applied through classes, never at call sites

```css
@theme {
    --text-display: 1.5rem;
    --text-display--line-height: 1.25;
    --text-title: 1.125rem;
    --text-title--line-height: 1.4;
    --text-label: 0.8125rem;
    --text-label--line-height: 1.4;
    --text-body: 0.9375rem;
    --text-body--line-height: 1.55;
    --text-meta: 0.75rem;
    --text-meta--line-height: 1.35;
}
```

`.type-display` (page titles) · `.type-title` (section heads, card heads) · `.type-label` (toolbar labels, form legends, badges-with-text) · `.type-body` (default; set on `<body>`) · `.type-meta` (counts, ancestry, timestamps).

`head1` → `.type-display`, `head2` → `.type-title`, `head3` → `.type-label`, and the three old names stay as aliases for exactly one roadmap step. The ~83 ad-hoc `text-*` utilities at call sites become zero: any place that needs a size gets there through a component. Exceptions are the icon-sizing utilities, which get their own two-step scale (`.icon-sm` 1.125rem, `.icon-md` 1.5rem) replacing the ten broken `text-6` uses.

### Spacing rhythm

Base 4px (Tailwind's `--spacing`). Permitted steps: **1, 2, 3, 4, 6, 8, 12**. Nothing else, and no arbitrary values — which removes `mx-[0%]`/`mx-[8%]`/`mx-[16%]`/`mx-[24%]`, `w-[500px]`, `w-[400px]`, `w-100`, `w-80`, `max-h-164`, `m-[1px]`, `mr-[0.1rem]`, `max-w-130`. Chrome padding is fixed at `px-3 py-2` inside `ToolbarButton`/`ToolbarLink`/`SidebarButton`, which is already what they do — the point is that it stops being restatable.

The stage replaces margins:

```css
.stage {
    width: min(100%, var(--stage-width, 1600px));
    margin-inline: auto;
}
```

`--stage-width` is set by Density (comfortable 1280px, compact 1600px, dense 100%). Phones get the full width they are owed instead of `mx-[8%]`.

### Radius and elevation

Radius: `--radius-field` (0.25rem) for controls, `--radius-box` (0.5rem) for tiles, cards, dialogs and the Inspector. `--radius-selector: 1rem` is unused in both themes — delete it. Today `MediaLink` uses `rounded-md`, `CategoryCard`/`PersonCard`/`PlaceCard` use `rounded-sm`, `Tile` normalises all of them to `rounded-box`.

Elevation: exactly three.

```css
.elev-flat    { }                                       /* chrome, listings, rows */
.elev-hover   { transform, shadow-lg, shadow-primary/20 } /* tile hover/focus-visible */
.elev-overlay { shadow-2xl + .chrome-glass }            /* Inspector overlay, dialogs, sheets */
```

`.elev-hover` replaces the identical four-line hover string duplicated in `MediaLink.tsx`, `CategoryCard.tsx`, `PersonCard.tsx` and `PlaceCard.tsx`. Crucially it applies on `:focus-visible` too, which is how keyboard users get the same affordance for the first time.

### Icons

**One set, one style: `ic--round-*`.** 124 of 176 icon uses already are. The 8 `ic--outline`, 4 `ic--baseline`, 2 bare, 1 `ic--sharp` and 36 `mdi--` uses convert. Mapping for the mdi ones: `heart`→`round-favorite`, `heart-outline`→`round-favorite-border`, `heart-box`→`round-filter-alt`, `label`→`round-label`, `counter`→`round-tag`, `face-recognition`→`round-face`, `folder`→`round-folder`, `file-multiple`→`round-file-copy`, `weight`→`round-storage`, `theme-light-dark`→`round-brightness-6`, `chevron-double-left`→`round-keyboard-double-arrow-left`, `arrow-right-thin`→`round-arrow-right-alt`, `image-size-select-large`→`round-photo-size-select-large`, `sort-alphabetical-variant`→`round-sort-by-alpha`, `sort-numeric-variant`→`round-sort`, `logout`→`round-logout`, `lightbulb-dimmer-50`→(deleted with the setting). Then `@iconify-json/mdi` comes out of `package.json`.

An ESLint rule (`no-restricted-syntax` on JSX string literals matching `icon-\[(?!ic--round)`) keeps it that way.

### Motion

Keep the four keyframes and the `prefers-reduced-motion` kill switch — they are the best-designed part of the current system. Add durations as tokens so the 150/200/400ms values stop being retyped:

```css
@theme {
    --motion-fast: 150ms;
    --motion-base: 200ms;
    --motion-slow: 400ms;
    --motion-ease: cubic-bezier(0.16, 1, 0.3, 1);
}
```

Colour/opacity transitions use `--motion-fast`, transforms `--motion-base`, image reveals `--motion-slow`.

### Keeping the two themes honest

Light currently declares 8 colour tokens; dark declares 9 (it adds `--color-primary-content`). Everything else is commented out in both, so daisyUI derives it — which is fine, but means neither theme is deliberate about the derived pairs, and light's `--color-primary` is `oklch(24.3% …)` while dark's is `oklch(80% …)`, so the derived content colours differ in kind.

Two mechanisms:

1. **`src/_themes/_contract.ts`** — the canonical list of tokens both themes must declare explicitly. Any token in the contract but absent from a theme is an error.
2. **`src/_themes/theme.test.ts`** — parses both CSS files, asserts the contract, and computes APCA/WCAG contrast for every `(x, x-content)` pair plus `(base-content, base-100)`, `(base-content, base-200)`, `(base-content, base-300)`, asserting ≥4.5:1 for text pairs and ≥3:1 for the icon/border pairs. This runs in `bun run test` and is the answer to "kept honest" — a token nudged in one theme fails the build until the other is considered.

Also delete the dead `.stage-backdrop` light-theme special case only if the contract test says the stage still reads correctly; my reading is it should stay — it is a genuine, well-reasoned asymmetry and the comment explains it.

---

### Corrections found while implementing (2026-09-12)

Two claims in §6 were wrong, and one real defect surfaced that §6 had not predicted.

1. **`--radius-selector` is not unused.** §6 said to delete it. daisyUI's `checkbox`, `badge` and `range`
   components all reference it, and this app uses all three (`checkbox` 9 occurrences, `badge` 16, `range` 24).
   It stays, and it is in the contract's required list.
2. **`--color-accent` _is_ unused** — zero references across every `.tsx` in the app. §6 did not notice this one.
   It is still declared by both themes and still in the contract for symmetry, but nothing renders it, so it has
   no contrast pair. A candidate for deletion in a later step, once it is clear daisyUI itself is not deriving
   anything from it.
3. **The dark theme failed three contrast pairs**, which is what the contract test was for:

    | pair                         | was    | now    | where it shows                      |
    | ---------------------------- | ------ | ------ | ----------------------------------- |
    | `base-content` on `base-300` | 4.04:1 | 4.55:1 | text on info cards and dropdowns    |
    | `secondary` on `base-200`    | 3.95:1 | 5.32:1 | toolbar and sidebar buttons at rest |
    | `secondary` on `base-300`    | 3.34:1 | 4.50:1 | InfoCard headings                   |

    Fixed by raising lightness only — hue and chroma are untouched in both cases. `--color-base-content`
    64.02% → 67.2%, `--color-secondary` 59.9% → 68%. The `secondary` change is the larger of the two and is
    visible in dark mode, which is the default theme. It matters more than it looks: `InfoCard` is
    `text-secondary` on `bg-base-300`, and §3 promotes that card into every view as the Inspector.

    Both themes also now state `--color-secondary-content` explicitly (it is used in 8 components for the
    button hover state) rather than leaving it to daisyUI's derivation.

### Correction found in step 2 (2026-09-12)

§6's mdi mapping sent `mdi--lightbulb-dimmer-50` to "(deleted with the setting)". Decision 1 kept the dim
toggle, so its icon needed a real destination rather than a deletion: it is now `ic--round-tonality`, and
`mdi--theme-light-dark` takes `ic--round-brightness-6` so the two do not collide.

Converging the families also fixed a live inconsistency §6 had not called out: the thumbnail-size button was
`ic--round-photo-size-select-large` in six toolbars and `mdi--image-size-select-large` in `ToolbarDetail` — the
same action wearing two different glyphs depending on which view you were standing in.

### What step 3 changed beyond the plan (2026-09-12)

**Two of §5's migration rules were wrong, and a runtime test caught it.** §5 described `showBadges` as an OR
across the six old flags. But all six _shipped off_, so the only preference anyone could ever have expressed
was turning them on — there is no "off" to preserve, and decision 5 puts them on for everyone. It is now not
migrated at all; the new default applies. The mirror-image mistake was `showLabels`: titles, years, names and
counts all shipped _on_, so the deliberate act there was switching them off, and it needs the opposite rule.
It migrates as "off if switched off anywhere". The general principle, now stated in the code: **the
non-default choice wins**, whichever direction that runs in.

**Density's mapping is pinned so that today's defaults are unchanged.** `comfortable` resolves to exactly what
the app shipped — the default grid size, the default list size, the default margin — so a reader who never
touched either old control sees no difference. `compact` and `dense` tighten from there. Grid and list resolve
the same density to different sizes, which is how one knob serves both without a list of rows suddenly
carrying 160px thumbnails.

**The size and margin buttons had become the same button.** Once both wrote to `density`, `s` and `m` did
identical things. They are one "Density" control now (6 margin buttons removed across the toolbars), and the
three breadcrumb toggles went with them, which is decision 3 arriving in step 3 rather than step 8.

**Settings → Browsing was pulled forward from step 13.** The four settings pages each presented density,
labels, badges and dimming for _their_ surface. Once those became one global setting each, the pages were
showing the same control two and three times over, all bound to the same value. The global ones moved to one
new Browsing page and the four existing pages keep only what is genuinely theirs — Categories and Search are
down to a single control each.

**`AppSettings` became a real store rather than an adapter over itself**, since it is both the legacy context
and one of the four targets. Its consumers moved with it: `isPrimaryNavCollapsed` is now `navExpanded`, which
reads the way the code uses it.

### Step 4 notes (2026-09-12)

**`stats/Year` was rendering an empty treemap** both while its query was in flight _and_ after it had failed —
it only guarded the error case around a sibling `<Show>`, so the chart drew itself from no data. It has a real
loading state now.

**The order of the branches is the load-bearing part.** `AsyncBoundary` tests the error first, because a failed
query leaves its data undefined, which is indistinguishable from still-arriving. Testing for data first is what
leaves a broken screen skeletoning forever, and it is a mistake that is easy to make once per screen and
impossible to make once the component owns it. There is a test for the ordering.

**`ErrorMessage` kept its name** rather than becoming `ErrorState` as §4 proposed. It is already the single
error surface and is imported directly by nine call sites where a whole boundary does not apply — the app
bootstrap, a section inside the people grid, the nested pickers in the place-cover dialogs. Renaming it would
have churned those files to no benefit; `AsyncBoundary` uses it internally.

**Five nested pickers still hold their own triad** (`PlacePicker`, `PlaceCoverCategories`,
`PlaceCoverCategoryMedia`, `PlaceCoverDialog`, `PlaceCoversCard`). They are components inside dialogs rather
than screens, where a page-level skeleton would be wrong. They use the shared `ErrorMessage` and `EmptyState`,
so they are consistent without being converted.

**`PermissionState` was not built.** §4 listed it, but the unauthorized path is a redirect in `AuthGuard`, the
admin path is a redirect in `AdminGuard`, and the inactive-account path is a whole page. There is exactly one
thing it would render today, and inventing a component for one caller is how the duplication being removed
here got started. It belongs with the admin surfaces in step 10.

### Step 5 notes (2026-09-12)

**`skipLibCheck` is now on.** Kobalte's bundled declarations contain `declare const X: typeof X` for a number
of type-only exports - a rollup-dts artifact that TypeScript 6 rejects - so `tsc` failed inside `node_modules`
before it ever reached `src`. This stops type-checking _inside_ `.d.ts` files and changes nothing about how the
application's own code is checked, which is still `strict`. The trade-off worth naming: a future dependency's
broken declarations will now also pass unnoticed.

**The shortcut guard replaced five workarounds.** The app binds single letters, so every keystroke in a text
field also pressed a toolbar button. Five inputs defended themselves with `evt.stopPropagation()` in their own
keydown handlers, which meant each new input was broken by default until someone noticed. `ShortcutWrapper`
now declines to fire while focus is in an input, textarea, select or contenteditable, and the five local
workarounds are gone. This is §7's change, arriving here because converting the dialogs surfaced a sixth
instance of it.

**What Kobalte actually bought.** The five dialogs already got a focus trap and Escape from the native
`<dialog>` element. What they did _not_ have was consistent labelling for a screen reader, and each needed an
effect calling `showModal()`/`close()` to chase a prop - `PlaceCoverDialog` had a fifteen-line comment
explaining why its version of that effect had to be guarded on the element's current state to avoid yanking
focus mid-choice. `open` is declarative now and that whole class of problem is gone, along with the comment.

**A test-isolation trap worth knowing about.** Portals mount on `document.body`, _outside_ the container that
testing-library's cleanup removes, so a dialog from one test is still in the document during the next. Combined
with `isolate: false` in the vitest config, exercising both dialogs in a single file left the two portals
confusable and the role assertions read the wrong one. The fix is one file per component plus an explicit
`document.body.innerHTML = ""` teardown. Kobalte is not at fault - `AlertDialogContent` passes its role per
instance, verified in the library source - but any future portal test needs the same teardown.

### A regression step 5 shipped, and why nothing caught it (2026-09-12)

The Kobalte wrappers borrowed daisyUI's `.modal-box` for the dialog surface. That class sets **`opacity: 0`
on itself** and is only revealed by rules requiring an open `.modal` ancestor - `.modal[open] > .modal-box`
and friends. Outside a native `<dialog>` there is no such ancestor, so **all six dialogs rendered fully
transparent**: correct markup, correct roles, correct focus behaviour, completely invisible. It was reported
as "I am not seeing a dialog when I type ?", which was the cheapest of the six to notice.

Fixed by styling the surface from the app's own tokens - `bg-base-100 rounded-box p-6 elev-overlay` - rather
than borrowing a component class whose visibility depends on where it sits. `.modal-action` went the same way,
for coherence rather than necessity.

**The lesson is about the tests, not the CSS.** Twelve assertions covered these dialogs - roles, labelling,
error announcement, confirm-versus-cancel - and every one passed, because jsdom applies no stylesheet. An
attempt to close that gap by injecting the built CSS and asserting `getComputedStyle(...).opacity !== "0"`
looked promising (jsdom does resolve simple class-based declarations) but was then verified against the broken
code and **passed there too**: the built stylesheet has eleven `@layer` blocks and jsdom parsed 30 rules out of
several thousand, never seeing `.modal-box` at all. That test was deleted rather than kept, because a guard
that cannot fail on the bug it names is worse than no guard.

So: **anything whose correctness is "can you see it" needs a browser.** The unit tests in this repo can say a
dialog exists, is labelled and responds; they cannot say it is visible. Steps that change rendered appearance
should be looked at in the running app before being called done - which is how this one was found.

### Step 6 notes (2026-09-12)

**One collision was live, and the code knew it.** `ToolbarListing` carried a comment explaining that its `k`
had to sit on whichever listing you were _not_ in, because "every other letter on this screen is spoken for".
It was worse than that: the Category Teaser card in the info sidebar also binds `k`, and the sidebar is present
on a feed's detail view - so on that screen `k` was registered twice. The other two overlaps were inconsistent
rather than live: `g` meant Grid on a media screen and Merge on the places screen, `p` meant the places media
listing and the slideshow. Navigation has vacated all of `g`, `w`, `f`, `z`, `/`, `k` and `p`; what is left on
those letters is a single action each.

**`ToolbarLink` is now private to `NavGroup`.** No screen constructs one directly any more, which is what makes
"numbered by position" true by construction rather than by discipline. The twelve `shortcutKeys` declarations
in `category`, `random` and `feed` route files are gone - `NavGroup` overrode them, so they were dead config
that still read as authoritative.

**Digits run across groups, not within them.** A feed's toolbar is two navigation groups - the listing switch,
then the view links - and `1`-`5` has to run through both. `NavGroup` takes an explicit `digitOffset` and
`ToolbarListing` exports the count it occupies, threaded through the three view components that expose a
`leading` slot. A context handing out the next digit would have avoided the threading, but it would also have
made the numbering depend on mount order, which is exactly the kind of quiet fragility this step is removing.

**The dev-mode collision assertion is still deferred.** §7 wants `ShortcutContext` to throw when two different
descriptions claim one key. It cannot go in yet: the letter collisions inside the toolbars are real and stay
until step 8 replaces them, so the assertion would fail on startup today. It belongs with `ListingToolbar`.

### Step 7 is half done, deliberately (2026-09-12)

`CategoryCard`, `PersonCard`, `PlaceCard` and `MediaLink` really are four copies of one tile. But unifying
them into `Tile` _changes the markup_ - that is the whole point of it - and step 5 had just finished proving
that this repo's tests pass happily while the result is invisible to anyone using it. Rewriting every tile in
the application on that basis, with no way to look at the outcome, is not a trade worth making.

So the step was split at the line where "no visual change" can be _proved_ rather than hoped for.

**First, the markup was pinned.** `listing/cards.snapshot.test.tsx` renders all four tiles and snapshots what
they emit, character for character. Anything that moves now shows up as a diff to read.

**Then only what is provably identical was extracted:**

- `createImageReveal` - the signal seeded from `hasRevealed`, the `reveal` that marks and sets, and the
  `onMount` that checks `complete` because a cached image fires its load event before the handler exists.
  That last part is the subtle one, and it had been reasoned out again in a comment in all four copies.
- `FavoriteBadge` - byte-identical in three of them, including the pinning to the second column of the shared
  two-by-two grid.

89 lines left the four files and the snapshots did not move.

**What remains, and what it needs.** `Tile`, `Row`, `ListingSurface`, the keyboard cursor, and collapsing
`MediaGrid`/`YearGrid` plus the four inline `flex gap-2 flex-wrap place-content-center` blocks. Every one of
those alters what is rendered, so each wants the snapshots read as a diff and the result looked at in a
running browser. The snapshots are in place precisely so that work can be reviewed rather than trusted.

Worth noting while in there: `MediaLink` takes a `route` prop that is **read zero times**, threaded to it by
both `MediaGrid` and `MediaList` at every call site. It goes with the `Tile` work.

### The shortcut guard was half a fix (2026-09-12)

Step 5 moved the "do not fire while somebody is typing" check into `ShortcutWrapper` and deleted five
per-input `stopPropagation` workarounds. The check was correct and the workarounds really were redundant - but
the fix was incomplete, and the result was worse than what it replaced: **no text field in the application
could accept a letter that was bound to a toolbar button.** Reported as not being able to type a `t` into a
clan's name, `t` being "Titles" in four toolbars.

`createShortcut` from `@solid-primitives/keyboard` defaults to `preventDefault: true`, and cancels the
keystroke _before_ it calls back:

```js
if (equalsKeyHoldSequence(sequence, keys)) {
    preventDefault && e && e.preventDefault(); // ← before the callback
    callback(e);
}
```

So declining to act stopped the _action_ while the character was already gone. The callback does receive the
event, so the fix is to pass `preventDefault: false` and cancel it in the handler instead - only on a press
that actually does something.

Writing the test for it turned up a second case nobody had reported: a **disabled** control also swallowed its
key. It declined to act, and the keystroke vanished anyway.

The lesson is the same one as the dialogs, in a different costume: the guard was verified by reasoning about
what it prevented, not by checking what a reader could still do. The test now asserts both halves - the
handler does not fire _and_ `defaultPrevented` is false - and was confirmed to fail on the old code before
being kept.

### `system` cannot be a step in a cycle (2026-09-12)

Decision 13 added a third theme, and step 3 put it in the navigation toggle as a third step:
light -> dark -> system -> light. But `system` is not a third appearance - it renders as one of the other two.
On a dark desktop the cycle reads as **dark, dark, light**, and one press in three appears to do nothing.
Reported as having to click twice to reach light mode.

The toggle now flips away from what is _resolved_ - whatever is on screen, to the other one - so a press is
always a visible change, and it always lands on an explicit choice rather than back on `system`.

That leaves `system` needing somewhere to be chosen, which §5 had planned anyway: **Settings -> Appearance**,
holding the three-way theme choice plus the navigation rail and toolbar-label preferences that step 3 had
consolidated into `AppSettings` without giving them a home. The nav button's tooltip now names its
destination - "Switch to Light Theme" - rather than saying "Toggle Theme" and leaving the outcome to be
discovered.

The test asserts the property rather than the mapping: for every starting choice, on both a light and a dark
desktop, toggling changes the resolved theme. The old cycle fails it on exactly one case - starting from dark,
on a dark desktop - which is the press that was reported.

### Two buttons, one setting (2026-09-12)

Step 3 merged `showFavoritesBadge` and `showTypesBadge` into a single `showBadges`, per decision 5 - but left
**both buttons** in five toolbars. They read the same flag and wrote the same flag, so pressing either one did
the same thing. Reported as "toggle favorites and toggle media types seem to do the same thing".

This is the same mistake as the density controls in that step, where `s` and `m` both ended up cycling
density. That one was caught while writing the code; this one was not, because the two badge buttons live in
different files from each other and the duplication is only visible once you know both write to one store.

They are one **Badges** control now, on `h`, and `ToggleShowTypesButton` is deleted - a file whose component
was also, incidentally, _declared_ as `ToggleShowFavoritesBadgeButton`, having been copy-pasted from its
neighbour and never renamed. `e` is freed as a listing key; what remains on it is the Effects card and the
Places edit mode, which decision 6 separates in step 9.

**The general shape of it:** every setting that step 3 collapsed is a candidate for this. Two controls that
used to mean different things now mean one thing, and nothing in the type system notices.

Auditing the rest immediately turned up the same fault in **labels**, and something worse alongside it. Titles,
years, names and media counts were four buttons over what is now one `showLabels`, so Search, People and a
feed's categories each had _two_ buttons doing one job. They are one **Labels** control on `t` now, which frees
`y` and `c`.

Worse, though: those toolbars carried the title-to-thumbnail coupling §2 had flagged for deletion - "turning
titles on forces the largest thumbnail, and the size button goes disabled". Both halves had rotted once density
became three named steps behind one store:

- `ensureLargeThumbnails()` called `setThumbnailSize(...)`, which the adapter maps to `cycleDensity()`. So
  **pressing the titles button changed the density.**
- The guard `disabled={settings.showTitles}` read a flag that now defaults to _true_, so **the density button
  was greyed out by default** in the categories grid, and dead behind an `if` in Search and the feed.

The coupling is gone rather than repaired: it existed because the tile reserved no room for a label, and it
has nothing to say about a three-step density.

### `children()` runs a slot where it is written, not where it is rendered (2026-09-12)

`AsyncBoundary` resolved all three of its slots through Solid's `children()` helper. That helper evaluates
them **in the wrapping component's own scope**, so the categories grid's

```tsx
<For each={Object.keys(categoriesToDisplay()!)...}>
```

ran while the query was still in flight, and `Object.keys(undefined)` threw. Every screen converted in step 4
was exposed; it showed up as "This page could not be displayed" on a cold load, because that is the page-level
boundary in `App.tsx`.

The repo already warned about this, in `AppErrorBoundary`, which avoids the same helper for the same reason
and says so in a comment. It was written, read, and then walked into anyway.

**It was invisible because the boundary threw the evidence away.** `describeError` turns a failure into a
sentence a reader can act on, which means discarding everything specific about it - and the fallback rendered
that sentence without logging the original. A report of "I get the generic error" had no message, no stack and
nothing in the console behind it. The boundary logs what it caught now.

**The same fault was in three more places**, two of which matter more than the one that was reported:

- `Dialog` and `ConfirmDialog` built their children while closed.
- **`AuthGuard` and `AdminGuard` built theirs regardless of the guard.** A screen behind either one ran its
  component bodies and fired its queries before anyone had been let in; the `<Show>` governed only what
  reached the document. Both predate this work.

The regression test asserts what actually matters - that children which reach into absent data do not run
during the loading or error states - and was checked against the eager version first, where it fails.

### Re-reading §11 against the installed library (2026-09-12)

§11's mapping table was written before anything was built, and two of its rows do not survive contact.

**Kobalte has no `Toolbar` primitive.** The table named one for the roving-tabindex work in step 8. It is not
in the package. That behaviour - one tab stop per toolbar, arrow keys between the controls - has to be
hand-rolled, which is perhaps thirty lines of keydown handling, and is still worth doing.

**`Select` and `RadioGroup` should stay native.** Both are real `<select>` and `<input type="radio">` elements
today, which already carry keyboard behaviour, grouping and labelling from the browser - and a native
`<select>` opens the operating system's own picker on a phone. Kobalte's versions are custom listboxes: better
to style, worse on touch, more code. Replacing a working native control to gain styling nobody asked for is not
a trade this rework should make. Struck.

What is still worth adopting, the rule being that a primitive earns its place where the hard part is
_behaviour_ rather than markup:

| Where                                               | Primitive          | Why it is worth a dependency                                                                                     |
| --------------------------------------------------- | ------------------ | ---------------------------------------------------------------------------------------------------------------- |
| `ItemActions` (the `⋮`), step 10                    | `DropdownMenu`     | Focus trap, typeahead, arrow keys, escape, click-outside, placement. The one thing here nobody should hand-roll. |
| Inspector overlay and sheet, step 12                | `Popover`          | Dismissal, focus return and scroll locking, which is most of that step                                           |
| Stats type/mode and the places kind filter, step 13 | `SegmentedControl` | A real primitive in the package, and an exact fit                                                                |
| `input/Switch`, step 14                             | `Switch`           | Modest: `role="switch"` is right for a toggle, where a checkbox is not                                           |

Worth adding to the list: **`Combobox` for `PlacePicker`**, which is hand-rolled filter-then-choose and is
precisely what that primitive is.

**Cost, measured.** `Dialog` + `AlertDialog` took the main chunk from 302.77 kB to 318.86 kB - about 16 kB raw
for two primitives. Worth knowing per-primitive rather than assuming the library is free.

**And one that looks like a Kobalte problem but is not.** The application has **127 `title=` attributes and two
`aria-label`s**. A tooltip primitive would make those prettier without making a single icon-only button
announce itself, and tooltips are a dead end on touch anyway. The fix is §8's: a required label prop on
`ToolbarButton`, `ToolbarLink`, `SidebarButton` and `IconButton` rendering `aria-label`. No dependency.

### Step 8 notes (2026-09-12)

The controls had already been reconciled by hand, one report at a time - badges, then labels, then the density
button that the label coupling had disabled. This step is what stops that happening again: there is one
component now, so a control cannot exist in one listing and not the next, cannot be named differently, cannot
answer a different key, and cannot sit in a different order.

**Which controls a listing offers is still its own decision** - a list row shows its title as part of the row,
people have no badges, media have no labels - but that is the only decision left to it. The flags are explicit
rather than inferred, because "does this listing have labels worth toggling" is a real question with a
per-listing answer.

**`ListingToolbar` reads `ListingSettings` directly**, not through a screen's adapter. That is what makes a
change in one listing show up in the next, and it is the first real consumer to move off the step 3 adapters -
the rest follow in step 14.

**A large unwinding fell out of it.** Once the toolbars wrote to the store themselves, every
`setShowFavoritesBadge` and `setShowTypesBadge` threaded from nine screens, through three view components, into
three toolbars was dead. The _reader_ props stay for now - a tile still has to be told whether to draw a badge -
and they go when `Tile` reads the store itself in step 7.

**The dev-mode key-collision assertion still cannot go in**, and now there is a number on it: three keys carry
two meanings each, and all three are the info-sidebar card letters -

| key | meanings                                      |
| --- | --------------------------------------------- |
| `c` | Sidebar: Comments · Choose This Place's Cover |
| `e` | Sidebar: Effects · Administer These Places    |
| `o` | Sidebar: Histogram · Sort                     |

Decision 6 removes those letters in step 9. Every other key in the application - twenty-two of them - already
carries exactly one meaning. The assertion goes in with step 9, where it can pass.

### The Inspector reaches the grid (2026-09-12)

This is the complaint the whole rework started from - _"the grid view is great to browse, but if you want to
see any of the details or tools, you need to use the detail view"_. Comments, EXIF, the histogram, the minimap
and the editing cards existed on exactly one screen. They are now on four.

**A registry, not a component that knows about views.** Each card declares what it is and an `appliesTo`, so
mounting the inspector somewhere new costs one line and no card has to be told where it is. Two cards decline
on their own account: the minimap stands aside on the map, where it would say the same thing twice, and the
histogram needs an element whose pixels it can read. The grid and fullscreen views now track that element for
the same reason the detail view always did.

**The grid's overlay had to be re-measured first.** The enlarged photograph was positioned by assuming the
stage was flush with the bottom-right of the window - `left = windowWidth - contentWidth`. That stops being
true the moment a 500px panel docks beside it, and would have put the photograph underneath the inspector. It
reads the stage's own bounding rect now, which is right whatever is next to it. §0.5 predicted this one.

**The card letters are gone, and the guard is on.** Eight single letters opened eight cards, and three of them
were the last remaining collisions in the application - `c` was also a place's cover, `e` an edit mode, `o` the
people sort. `i` opens the panel; the rail is focusable. **Every key in the application now carries exactly one
meaning**, and `ShortcutContext` says so at registration if that ever stops being true.

That guard _reports_ rather than throws, which §7 had asked for. A key genuinely held twice deserves shouting
about, but a route change can briefly have the outgoing screen's controls mounted alongside the incoming one's,
and taking the application down over a transient overlap would be worse than the fault it is reporting.

**And a fault only mounting it elsewhere could reveal.** Every card reaches into the photograph without
checking - `props.activeMedia!.id` - and none of them ever had to, because the detail view is itself gated on
having one open. A grid or a map can be looked at with nothing selected at all, so the comments card asked the
API for the comments of `undefined` and the page fell over on arrival.

The rule lives in `applicableCards` now: nothing applies without an item to apply it to. One place rather than
eight cards, the rail goes empty instead of offering cards that cannot render, and it is unit-testable. The
panel answers the state instead - "nothing selected" is a perfectly ordinary thing for a grid to be.

Same family as the eager-`children()` crash: something built before the thing it describes exists. Worth
watching for through the rest of this work.

**Not done, deliberately.** The _Adjust_ card - moving rotate and flip out of three toolbars - is a change in
where a tool lives, and those four buttons currently carry keyboard shortcuts that work whenever a photograph
is on screen. Putting them in a card would silently make the keys conditional on the card being open unless
they are also registered at the view level. That is worth doing properly rather than as the tail end of a large
step. The bulk-edit cards are unfolded for the same reason: that panel is a different shape (it acts on a
selection, not on one item) and wants its own thought.

### Deleting the Detail view (2026-09-13)

Decision 4 and 8, and the prerequisite §0.5 set for it - the inspector reaching the grid - landed in step 9.
What detail still had of its own by then was the filmstrip, and that was reported as "a little clumsy" when the
decision was made. The grid was already showing the same photograph, over the grid, through the same
`MainItem` component.

**What went:** `ViewDetail`, `ToolbarDetail`, `MediaList`, the three screens (`category`, `random`, feed), and
`MediaDetailViewSettingsContext` - seven files, 613 lines.

**The addresses stay.** `/detail/:mediaSlug` and its feed and random equivalents still resolve; they render a
redirect to the same slug under `/grid`. A substitution rather than a parse, because the slug is identical in
both, so anyone holding a link lands on the photograph they were sent. These stay indefinitely.

**The saved view is handled twice, deliberately.** The migration maps a stored `"detail"` to the grid, and
`MediaSettingsProvider` also checks the loaded value against the views that exist. The migration runs once, and
somebody may already have carried `"detail"` into the new store during the days this branch has been in
progress - checking only in the migration would send them to a redirect on every visit, for ever.

**`showFilmstrip` went with it.** It was migrated into `MediaSettings` in step 3 and had no consumer left once
the filmstrip was deleted - a setting for a control that no longer exists is worse than no setting.

**A note on method.** Two blunt line-wise deletions broke `switch` statements mid-case and produced a wall of
parse errors. `git checkout` on the affected files and a surgical pass got it back, but the lesson is the one
from the earlier `git checkout` mishap in reverse: a regex that deletes _lines_ containing a name will happily
cut a `case` from its `return`. Deleting a _construct_ needs a pattern that matches the whole construct.

### Step 9b silently removed downloads and sharing (2026-09-13)

Deleting the detail view took `ToolbarDetail` with it, and that toolbar was the only thing that rendered the
low-res download, the high-res download, the category zip and the share button. Four working components were
left in the tree - importable, compiling, reachable from nowhere. **The application lost the ability to
download a photograph**, and typecheck, lint, 150 tests and a production build all passed.

Step 10 was the step that gives them a home, so they were only missing for one commit. That is luck rather than
design: nothing in the repository could have told me.

**So the repository can tell me now.** `src/orphans.test.ts` walks every module and fails if one is reachable
from nowhere. It found the four immediately, and two more that predate this work entirely - `UtilityTypes.ts`,
unused since July, and `ChartUtils.ts`, a chart colour palette unused since August 2025. Both deleted; git
keeps them.

**Where the actions went.** A `⋮` menu rather than four more toolbar buttons: they are used rarely and read as
a list - "high resolution", "low resolution", "the whole category" - where four more icons would be four more
things to decode on a toolbar that has enough. Kobalte's `DropdownMenu` gives it the focus trap, typeahead,
arrow keys, escape and click-outside that §11 said nobody should hand-roll.

It is mounted in `_media/Toolbar.tsx`, the one place that already knows both the photograph and its category,
so all four views get it without threading a prop through three toolbars.

**A widening that was wrong, and the correction.** The category zip was first offered wherever the photograph
was, on the reasoning that a photograph belongs to a category however you reached it. That is true and beside
the point: in a person's or a place's feed the current photograph's category is _incidental to the list_, so
offering to download all of it answers a question nobody asked.

Worse, the action had been attached to the wrong thing entirely. A category download is about what is being
**listed**, not about the item selected within it - so it also has to be available with nothing selected at
all, which is how most of a visit to a category is spent, and the `⋮` only appeared once a photograph was
picked.

Both fixed by asking the service rather than inferring from what happens to be on screen: `IMediaService`
gains `canDownloadCategory()`, false on the base and true only for `CategoryMediaService`. The menu now
appears when _either_ scope has something to offer, and holds two groups - the resolutions and the share, which
need a photograph, and the category zip, which needs a category being browsed.

That method is the first piece of step 11's capability work arriving early, because this is exactly the
question it exists to answer.

### Step 11 notes (2026-09-13)

Three toolbars, and the drift §2 described. Grid and fullscreen were near-identical - the same paging, the same
slideshow, the same rotate and flip, in slightly different orders and with slightly different gating. The map
had **previous and next and nothing else**: no slideshow, no badges, nothing. Not a decision, just a view
nobody had gone back to.

**What differs is now declared rather than duplicated.** A map draws markers, so there is nothing to rotate and
no tile to badge. A grid is the only view that lays out tiles, so it is the only one asking how densely. Every
other control is in every view because there was never a reason for it not to be.

**The call sites shrank from about ten props to four.** `activeMediaIsFirst`, `activeMediaIsLast`,
`slideshowIsPlaying`, `canRequestMore`, `moveNext`, `movePrevious`, `toggleSlideshow`, `requestMore` were all
being read off the service by the view and handed back to a toolbar that could have asked the service itself.
It does now.

**The map gained a slideshow**, which §2 asked for and which turned out to be a missing service rather than a
missing button - `useCategoryMapServices` never built one, alone among the media hooks. Watching the map step
between markers is the best thing that view does.

**And four props fell out that had been dead since step 3.**
`enableToggleBreadcrumbsOnActiveMedia` and its inactive twin were declared on `ViewGrid` and passed by three
screens, and read by nothing - the buttons they controlled were removed when decision 3 deleted the breadcrumb
toggles. The two remaining breadcrumb props are real and stay: they decide _where_ the trail goes, which is a
question about the feed rather than a preference. A category's grid names the category above the tiles; a
person's spans categories, so the trail only means something on the photograph itself.

### Steps 13 and 14, as far as they can go yet (2026-09-13)

The adapters from step 3 split cleanly in two once the work reached them.

**Seven were pure renames** - the page view modes, the category year and GPS filters, the feed's options, the
map, the info panel and the media page. Those carried no derived values: `viewMode` was `categoriesView`
spelled differently. All seven are gone and their thirty-odd consumers read the store directly, in the store's
own vocabulary.

**Eight are not renames**, and they are the listing ones. `CategoryGridViewSettings` and its siblings answer
`thumbnailSize` by deriving a pixel size from the density, because the tiles need pixels. Deleting those
adapters does not remove the derivation, it moves it into every screen that draws a tile. It disappears
properly when `Tile` reads the store and sizes itself - which is the rest of step 7. So they stay, and step 14
finishes there.

**The settings pages came along with it**, which is most of step 13. They read the stores now, and the Media
page's inspector section is generated from the card registry rather than listing eight checkboxes by hand -
eight chances for the page and the panel to disagree about which cards exist. The Appearance and Browsing pages
already arrived, in step 3 and with the theme fix. A Shortcuts page, generated the same way, is what is left.

### View transitions (2026-09-13)

Going from a photograph in the grid to the same photograph in fullscreen _is_ the same photograph. The
application knew that; the screen did not, because one view was torn down and another built in its place. The
browser will tween the two if it is told they are the same thing, which is all a `view-transition-name` is.

**One hook, not an animation per screen.** `useBeforeLeave` claims the navigation, wraps `retry()` in
`document.startViewTransition`, and everything cross-fades by default. Only the main photograph carries a name,
so only it morphs - and only one is ever on screen at a time, which the name requires.

**Three guards, all of them tested.** It stands aside where the browser has no View Transitions API, where the
reader has asked for reduced motion, and - the one worth naming - where `defaultPrevented` is already set,
which means something else has claimed the navigation. Calling `retry(true)` there would override a guard's
redirect to the login page.

The reduced-motion guard is doubled in CSS, because a view transition animates through
`::view-transition-group` and friends, which the universal selector in the existing kill switch does not reach.

Timing comes from the motion tokens rather than the browser's default quarter-second, so it reads as deliberate
rather than as a flicker.

### `ListingSurface`, and a cursor where there was none (2026-09-13)

Twelve places wrote out `flex gap-2 flex-wrap place-content-center` for themselves. Harmless until somebody
wants to change how a listing behaves, and then it is twelve places.

What the component adds beyond the class string is the thing §8 found missing: **categories, people and places
could not be moved through from the keyboard at all**. Every tile was a tab stop, so reaching the fortieth
meant forty presses, and there was no way to move down a row.

It was shipped with only half the fix. The arrows were there, but every tile was _still_ its own tab stop -
which left the original complaint untouched: getting to the tiles cost a press each, and the fortieth was still
forty away. Reported as "if i click on a tile, like a person, that navigates me into that person", which is the
point: a click is not a way to place the cursor, so Tab was the only way in, and Tab was exactly what had not
been fixed.

A roving tabindex is the whole fix. The listing is **one** tab stop; Tab lands on wherever the reader was, the
arrows move between items, Tab again leaves. The stop follows the cursor, so leaving a listing and coming back
returns to the same tile, and focusing one directly - by click, or by shift-tabbing in from below - adopts it
rather than being undone.

The tab stops are reapplied as the children change, through a `MutationObserver`: tiles arrive after the
listing does, as a query resolves or a filter narrows or paging appends.

**How many fit across is measured, not assumed.** Tiles wrap, their size follows the density, and a listing can
be any width, so the row length comes from which items share a top edge.

**The cursor is opt-in, and off in the media grids.** The arrows there already step through photographs. Two
things answering one key is precisely the fault steps 6, 8 and 9 spent their time removing, and it would have
been careless to reintroduce it in the name of a new feature.

A press the surface acts on is **stopped as well as prevented** - the arrows are registered globally as
shortcuts too, and without that a single press would move the cursor _and_ whatever else claims the key. There
is a test for exactly that, because it is the sort of thing that works in the listing you tried it in and
misbehaves in the next one.

**The tiles were not touched**, which the snapshots confirm. `Tile` and `Row` remain, and they are what the last
eight adapters are waiting on: those answer `thumbnailSize` by deriving pixels from the density, and the
derivation only disappears when the tile sizes itself.

### `Tile`, and the eight adapters it was blocking (2026-09-13)

The step-7 note below says `Tile` was deferred because it changes markup and the tests would not have caught
it. That was right, and the snapshots are what made finishing it reviewable: three of the four tiles were
rewritten onto `Tile`, the diffs were read line by line, and the two that were wrong showed up immediately.

**The favourite heart got wrapped twice.** `FavoriteBadge` had been extracted in the first half of step 7
carrying its own `col-start-2 row-start-1` pinning, because it was byte-identical in three tiles _including_
the pinning. Correct then; wrong the moment `Tile` owned the corners, since passing it as `badges.topRight`
put a positioned box inside a positioned box. The snapshot showed the doubled `<div>` and nothing else would
have - it renders almost correctly. The badge is now the heart and nothing about where it sits.

**One rounding was quietly unified.** Three of the four tiles used `rounded-sm`; the media tile alone used
`rounded-md`. `Tile` takes the majority. That is a real visual change, small and deliberate.

**What the eight adapters were actually for.** Each answered `thumbnailSize` and `margin` by deriving pixels
from the one density, so a screen could keep asking the question it used to ask. Once `Tile` reads the density
itself the derivation has nowhere to live, and the same applies to `SkeletonGrid` (its placeholders must be
the size of what replaces them), `CategoryListItem`, and `Layout`. All four now read rather than being told,
and the last eight adapters were deleted - seventeen call sites stopped threading values they only forwarded.

**The margin stayed opt-in, on purpose.** Moving it into `Layout` made it tempting to apply it everywhere,
which would have indented all twenty pages including Settings and Admin - pages that had deliberately passed
no margin. What was never uniform is _which_ screens want one, so `Layout` takes a `margin` flag and the seven
listing screens that had one set it. Same rendering, one less thing threaded.

**`Row` was dropped from the step.** It was specified as the list-view counterpart to `Tile`, but step 9b
deleted the filmstrip and there is exactly one list item left in the application. A shared abstraction over
one implementation is worse than the implementation.

**Method, again.** The line-wise regex deletion broke three files a second time - `<SkeletonGridcount={12} />`

- in the same way it broke the `switch` statements in step 9b. It is fine for removing a whole `prop={...}`
  line and wrong for anything inline, and I reached for it inline anyway.

### Step 12, and what a phone was actually being offered (2026-09-13)

The gate was one line - `view === MediaViewGrid || gteMd()` - and it meant a phone was offered the grid and
nothing else. No fullscreen, no map, no bulk edit, on the device most likely to be holding the photographs.
The views themselves were never the problem; there was nowhere to put the chrome, so the feature was removed
instead of the layout being solved.

**The chrome now has two shapes.** A rail down the side from `md` up, a bar along the bottom below it - which
is where a thumb is, and the toolbar had been sitting along the top. `ToolbarLayout` gained a `nav` slot and
an `actions` slot for the things that never fold (the view switcher, and the `⋮` menu - already one button
hiding a menu, so putting it behind a second would be two taps to reach a download). Everything else goes
into a sheet behind one button. The children are rendered _once_ either way and moved between the bar and the
sheet, rather than being declared twice.

**The Inspector has three.** It was `w-[500px]`, on a viewport that can be 390px wide - which is to say it
was unusable on a phone, so it was simply never mounted there and its grid row was hard-coded to `0`. It
docks at `lg`, overlays the right-hand side between `md` and `lg`, and rises from the bottom below that. The
card chooser moves into the sheet on a phone: eight buttons plus the toggle is more than a 390px edge holds.

**`.stage` is a width, not a margin.** The four `mx-[N%]` classes took symmetric padding off both edges,
which reads fine on a monitor and is indefensible on a phone - the comfortable step gave away 16% of a 390px
screen to whitespace. As `width: min(100%, var(--stage-width))` the same number caps the content instead, and
below `md` it is ignored entirely. Only two of the four steps were reachable, so only two were kept.

**Fullscreen's chrome steps back after 2.5s.** Held up by a pointer resting on it or by focus inside it -
fading either out from under its reader would be worse than never hiding it. It collapses as well as fades,
so the photograph takes the room back rather than the strip sitting there empty.

**What jsdom can and cannot say.** The two new component suites check _markup_ - whether a control is in the
document, what `role` the panel carries - and deliberately not appearance, because jsdom lays nothing out and
parses almost none of the stylesheet. That distinction is the lesson from the invisible dialogs in step 5,
and both suites were run against the pre-change code first: three of six toolbar tests and three of seven
inspector tests fail there, which is what makes them worth keeping.

### §7's letter map was never implemented (2026-09-13)

Writing the Shortcuts page meant writing down what the keys do, and the obvious source was §7 above. That
would have shipped a reference to an application that does not exist. §7 proposes `d` for density, `l` for
labels, `b` for badges, `[` and `]` for rotation, `f` for favourites-only, `x` for shuffle, plus `t`, `n`,
`u` and `,` as new global keys. What is actually bound is the pre-rework set: `s` density, `t` labels, `h`
badges, `a`/`d` rotation, `u` favourites-only, `j` shuffle, and no global keys at all.

Steps 8 and 9 removed the _collisions_ - no letter carries two meanings now, which was the real complaint -
but they did not carry out the reassignment. That is a separate, user-visible change: it invalidates whatever
muscle memory a reader has, for the benefit of a tidier map, and it is not something to slip in under "add a
settings page". **It is left as a decision to make rather than a step to finish.**

The reference is therefore written from the bindings, and `ShortcutReference.test.ts` reads the source to keep
it that way: every letter a component registers must be documented, and every letter documented must be one a
component registers. Flipping one entry from `s` to `l` fails both halves, which is precisely the reference-
written-from-the-plan mistake it exists to prevent.

**Why a page at all, when `?` exists.** The dialog lists what is registered on the current screen, which is
the right answer to "what can I press here" and the wrong one to "how does this work" - the screen you would
be reading it on is the one screen whose shortcuts you are not asking about. The page carries the part that
is a rule rather than a list: the digits follow the toolbar's order, so there is one thing to learn instead
of a letter per screen.

### The Adjust card, and a reset that was already lying (2026-09-13)

Rotate and flip were four toolbar buttons. The sliders they share a state object with were in an Inspector
card - and `reset()` sets the whole of `defaultVisualEffects`, so pressing Reset in the Effects card
_already_ straightened a photograph that had been rotated from the toolbar. It simply did not show that it
was going to. One state, one reset, one card.

So the card is now titled **Adjust**, with the four transforms above the filters. It is not a ninth card: a
separate one would have put a reset button in one card that silently clears state shown in another, which is
the fault this move set out to fix rather than a new home for it.

**The keys had to survive the move.** A card is something you open, and a shortcut that only works while the
panel holding its button happens to be open is not a shortcut. `ShortcutWrapper` with no children renders
nothing and registers everything, so `AdjustShortcuts` keeps `a` and `d` bound from the toolbar - mounted for
as long as a photograph is on screen. That is the whole of the trick, and there is a test asserting the
component draws nothing while its keys are live.

The flips never had keys at all, so nothing was lost there; they gained a visible pressed state instead,
which four toolbar buttons had never shown.

**The orphan check paid for itself again.** Deleting the four button call sites left four unreachable files,
and `orphans.test.ts` failed the suite before the commit rather than after it - the same fault that shipped
undetected in step 9b and prompted the check.

### The browser going slow in mobile view was one word of CSS (2026-09-14)

Reported as: switch Chrome to device mode and _moving the mouse_ is slow, before touching anything. That
"before touching anything" is what made it findable - it ruled out every piece of application logic and left
hover.

Driving real cursor movement over the built CSS through the DevTools protocol (synthetic `mousemove` will not
do, it does not trigger `:hover`) put a number on it: **~87ms of main-thread work per mouse move** over a
listing of 1500 tiles at 390px, with style and layout recalculation near zero. So: paint. And it scaled with
the _total_ number of tiles rather than the visible ones, which meant hover was invalidating far more than the
tile under the cursor.

Bisecting the utilities found two that each independently removed the cost - `elev-hover` and `rise-in` -
which is the shape of an interaction rather than a culprit:

| variant                | per mouse move |
| ---------------------- | -------------- |
| everything on          | 87.3ms         |
| without `elev-hover`   | 2.9ms          |
| without `rise-in`      | 5.3ms          |
| without `chrome-glass` | 89.3ms         |

`.rise-in` was `animation: maw-rise-in ... both`. The `forwards` half of `both` keeps the animation filling
after it ends, which pins `opacity` and `transform` as animated properties, which keeps the element on its own
composited layer for the life of the page. That element is the _listing_ - at phone width, tens of thousands
of pixels tall. Every hover shadow inside it re-rastered a slice of that layer, and the taller the page the
worse it got, which is why a phone viewport was where it showed.

`both` → `backwards`. **87.3ms → 5.6ms**, and the per-move cost is now flat across phone, tablet and desktop
where it used to double at phone width. Nothing is lost visually: the `to` state is `opacity: 1; transform:
none`, which is what the element computes to anyway, so only `backwards` was ever doing work.

**`chrome-glass` was the obvious suspect and was entirely innocent** - 89.3ms without it. Worth recording,
because backdrop-filter is where I would have put money, and three cheaper hypotheses (the grid restructure,
the breakpoint machinery, `Tile`'s extra DOM nodes) were each disproved by measurement before this one.

`motion.test.ts` guards the fill mode. It is a string check over `index.css` and a blunt one, but the cost is
invisible at review time and severe at runtime, and nothing else in 190 tests could see it.

### The Inspector sheet was a panel with no way out (2026-09-14)

Reported against the phone sheet: no way to see how to toggle cards, and the bottom bar behaving oddly.
Reproducing the real markup at 390px and reading the geometry back said the positioning was right - the panel
is `fixed`, `top=253 h=591` for `70dvh`, and the bar stays where it is at `top=804`. It is not lifted. It is
_covered_, which is what a bottom sheet does, and that was the whole problem:

- **The rail it is opened from is underneath it.** On a phone the sheet spans the full width over the bottom
  bar; on a tablet the right-hand overlay sits on the rail just the same. So the control you would reach for
  to close it is beneath the thing you want to close. Tapping outside worked and always did, but nothing said
  so, and the toolbar's own sheet had had a header and a Close button since the day it was written. The
  Inspector's never got one. It has one now.
- **The card chooser scrolled away with the cards.** The panel root was `overflow-y-auto` with the chooser as
  its first child, so opening a card pushed the only means of closing it off the top. The panel is a flex
  column now: header and chooser `shrink-0`, and a single `grow overflow-y-auto` region holding the cards.
- **The chooser only existed on phones.** It was gated on `!gteMd()`, but the tablet overlay covers the rail
  exactly as the phone sheet does - so between `md` and `lg` there was no way to toggle a card at all. Both
  the chooser and the header are now gated on `!docked()`, which is the condition that actually describes
  "this is covering the thing that controls it". The rail keeps its own copy only when docked.
- **Eight unlabelled icons is not a menu.** `InspectorRailButton` takes `withLabel`, and the chooser row uses
  it. The rail is a narrow strip and stays icon-only; there is width for the word inside the panel.

Two of the three new tests fail against the previous component. The third - that the header is outside the
scrolling region - is markup, which is the only part of this jsdom can honestly speak to; the geometry was
checked in a real browser instead.

### It was bulk edit, not the Inspector (2026-09-14)

The screenshot settled an argument I had been having with the wrong component. The panel lifting the bottom
row was **`BulkEditSidebar`** - a second copy of what the Inspector had been before step 12 taught it three
shapes: a hard `w-[500px]` handed straight to the layout's sidebar slot, in flow, always open. Step 12 gave
the Inspector a sheet and never looked at the other sidebar in the same slot.

In flow at 390px it does exactly what was reported. Measured in a browser, old against new:

|        | bottom nav row               | panel                | document width         |
| ------ | ---------------------------- | -------------------- | ---------------------- |
| before | `top=244` **`h=600`** `w=0`  | `static`, 500px wide | 500 - scrolls sideways |
| after  | `top=804` **`h=40`** `w=362` | `fixed`, 390px       | 390                    |

The row stretched to the height of the cards and squeezed the toolbar beside it to **zero width** - the narrow
yellow strip in the report - while a 500px panel overflowed a 390px viewport.

**The fix was to stop having two of these.** `overlay/SidePanel` now owns the three shapes, the backdrop, the
Escape handling, the header with its close button and the pinned chooser slot; `Inspector` and
`BulkEditSidebar` are both callers. `usePanelShape` is exported alongside it because a caller has to answer
the same question about its own rail - in both overlaid shapes the panel covers the rail that opened it, so
whatever the rail offers has to move into the panel there.

Bulk edit keeps its old behaviour where it is docked: simply present, with no toggle, because a button
offering to close something that cannot be closed is a button that does nothing.

**What this says about the previous fix.** The Inspector work in the commit before was real and needed - no
close button, a chooser that scrolled away, a chooser missing entirely between `md` and `lg`. But I had
measured the Inspector, found its geometry correct, and reported that the row "is not lifted" - which was true
of the component I was looking at and false of the screen being described. The report said _infocard popup_
and I matched that to the Inspector's cards; bulk edit's panel is built from the same `InspectorCard`
component, which is why it looks like one.

### Bulk edit goes back behind a width gate, for a reason the old one did not have (2026-09-14)

Step 12 removed `view === MediaViewGrid || gteMd()`, which hid fullscreen, the map _and_ bulk edit on a phone.
Three of those four were hidden because there was nowhere to put the chrome, which is a reason to fix the
chrome rather than remove the view. Bulk edit is the fourth, and it is genuinely different: the whole job is
picking photographs from the grid and typing **one** set of coordinates for all of them, so the selection and
the form have to be readable at the same time. Below `lg` the tools come over the grid, which means entering a
location by covering the photographs it is for.

So it is offered exactly where the panel docks - `usePanelShape().docked()`, the same line the panel itself
uses, rather than a second opinion about width. The toolbar stops listing it, and `ViewBulkEdit` redirects the
way its `AdminGuard` already does, which covers a bookmarked URL or a window dragged narrower while it is
open.

**`BulkEditSidebar` lost the machinery it had just been given.** An hour earlier it gained a rail, an open
signal and a sheet shape; once the view is docked-only, all of that is unreachable. It is back to one shape -
still through `SidePanel`, so there is still only one implementation of the panel, but with no state of its
own.

**A latent bug the guard would have exposed.** `MediaBreakpointProvider` seeded its store with `md: false,
lg: false` and copied the real answer across in a `createEffect`, which does not run until after the first
render. So for one render every screen looked like a phone - a flicker while the only consumers were picking
a CSS class, and a bounce to the grid the moment something _navigated_ on the answer. The store is seeded from
the queries now. Worth recording as the general shape: a default that is merely wrong-for-one-tick is free
until someone acts on it.

### One switch, two places, depending where you stood (2026-09-14)

Reported on the places screen: the media/categories switch sits in the bottom bar while you are looking at
media, and behind the overflow ellipsis while you are looking at categories.

Both screens draw the same `ToolbarListing`, but reach `ToolbarLayout` by different routes. The media views
hand it to the media toolbar's `leading` slot, which forwards it into `nav`. The categories view renders it as
the first _child_ of `ToolbarLayout` - and children are exactly what folds into the overflow sheet below `md`.
Step 12 converted five toolbars to the `nav` slot and missed this one, because it was the only one whose
navigation arrives as a component rather than as a literal `<NavGroup>`.

It is the same fault as the bulk edit sidebar two commits earlier: a pattern applied to the obvious cases and
not to the one that looked slightly different. So the guard is on the _class_ rather than the case.
`navigation.test.ts` reads every file that renders a `ToolbarLayout`, finds where the opening tag ends - by
counting brace depth, since the slots hold JSX and the first `>` is nowhere near the end of it - and fails if
any navigation component appears after that point. Reverting the fix fails it by name:
`_media/feed/ToolbarCategories.tsx passes ToolbarListing as a child`.

Worth stating the rule the test encodes, because it is the one the bar is built on: **the `nav` and `actions`
slots stay on screen at every width; everything else may fold away.** That is the right trade for a density
toggle and the wrong one for the links you move around with.

### The accessibility list, items 2 to 4 (2026-09-14)

§8 listed eight of these in the order I would fix them. One, five and eight were done along the way; six has
the theme test behind it. Two, three and four were still open, and they are the ones a phone makes worst,
because every one of these controls hides its text label below `md`.

**Names.** `IconButton` is the real find: no `aria-label`, no `title`, no text - an icon and nothing else,
drawing the favourite heart on every tile in the application, so a listing announced a row of bare "button"s.
It now takes a **required** `label`, and the three callers say which way the toggle will go ("Add to
favourites" / "Remove from favourites") rather than naming the control.

Worth recording precisely, because I nearly wrote the opposite in a test: `title` **is** the last-resort
fallback in the accessible-name algorithm, so `ToolbarButton` and `ToolbarLink` did have names. Their
`aria-label` is a robustness fix - `title` support varies across assistive technology and it is invisible on
touch - not a fix for having none. The test that asserts it passed before the change, and says so; only the
`IconButton` and `aria-pressed` tests fail against the old code.

**State and landmarks.** `aria-pressed` on every toolbar toggle, `aria-current="page"` on both link
components, and `PrimaryNav` is a `<nav aria-label="Primary">` rather than a bare `<div>` - it is the one way
around the application and it was indistinguishable from any other box.

**One tab stop per toolbar.** A media view's chrome is around fifteen controls and each was its own stop, so
reaching the page meant tabbing past all of them. The roving cursor written for `ListingSurface` in step 7 is
now `a11y/rovingFocus`, shared by both, with an `axis` so a single-line toolbar leaves the cross-axis arrows
for whatever else wants them. Extracting it turned up a real gap: it counted _every_ child as a step, and a
toolbar has dividers and a spacer between its groups, so an arrow press could land on a separator and appear
to do nothing. It now skips anything that cannot take focus.

**Images.** All ten remaining `<img>` carry `alt`. Most are `alt=""` and deliberately so - a teaser inside a
link that already prints the category's name, a thumbnail beside its own checkbox, an avatar next to the name
it belongs to. Announcing those twice is worse than not announcing them.

### Arrowing into the `⋮` was a dead end (2026-09-14)

The roving cursor put on the toolbar an hour earlier had a trap in it: arrowing along the bar reached the
actions menu and opened it, instead of moving past it, and there was no way to arrow back out.

`ItemActions` is a Kobalte `DropdownMenu`, and a menu button opens on ArrowDown by convention. The cursor's
listener was on the container in the bubble phase, so the trigger - which binds its own handler to its own
element - saw the key first. Claiming it on the way down instead means it never reaches the trigger. That is
the toolbar pattern rather than a workaround: inside a toolbar the arrows belong to the toolbar, and Enter or
Space still opens the menu.

**The first test I wrote for it passed against the bug**, which is worth recording because it nearly shipped.
It used a JSX `onKeyDown` on the child to stand in for the trigger - and Solid _delegates_ `keydown` to the
document, so a JSX handler runs after any real listener on the container whichever phase that one uses. The
stand-in has to bind its own listener to its own element, as a library does, and then `capture: false` fails
it. Checking that a new test fails against the old code has caught something real for the third time in this
rework.

Two tests guard the edges of the fix, because capturing claims keys before anything below sees them: Enter
still reaches the trigger, and a text field keeps its own arrows - the filter boxes live in these toolbars and
an arrow there moves the caret, which `isEditableTarget` already answers for.

### The cursor was focusing things that cannot be focused (2026-09-14)

The capture fix stopped the menu opening, and the cursor still would not move past it. Different cause, same
symptom, and the second one was the older bug: **a disabled button still matches `button`**, so the roving
cursor counted it as a step and called `focus()` on it - which a disabled element silently ignores, while the
keystroke had already been consumed. Arrowing into a run of unavailable controls stopped dead with nothing on
screen to explain why.

Not a contrived state. A media toolbar disables three of its buttons in ordinary use - Request More with
nothing left to fetch, previous and next at the ends of a category - so on a category's media page the stretch
either side of the actions menu is routinely dead. It was reported against the `⋮` because that is where you
happen to arrive.

`FOCUSABLE` is now `a[href], button:not([disabled])`, which fixes the step _and_ the tab stop: `items()` is
built from the same predicate, so an unusable control is no longer a candidate for either. The disabled
element's own `tabIndex` is deliberately left alone - a disabled element is skipped by the browser whatever it
says, so setting it would be tidying something nobody can observe, and a test asserting otherwise was wrong
and got rewritten rather than made to pass.

This is the third distinct fault in one small primitive: non-focusable children counted as steps (found while
extracting it), the bubble phase losing the key to a menu trigger, and now disabled controls. All three were
invisible until somebody drove it with a keyboard, which is the argument for the eight tests now on it.

### Faded text was a contrast failure wearing a subtlety (2026-09-14)

§8 item 6 guessed `PlaceCard`'s ancestry line and the `text-base-content/40` placeholders would fail first. It
was worse than that, and in a way the theme test was built not to see: that test compares one _token_ against
another, and `opacity-70` is neither - it is an alpha composite of a token over whatever happens to be behind
it.

Computing what those composites actually render as:

|                   | `@0.7`     | `@0.4` |
| ----------------- | ---------- | ------ |
| light on base-100 | **2.81:1** | 1.58:1 |
| dark on base-100  | 4.56:1     | 3.03:1 |
| dark on base-200  | 4.09:1     | 2.76:1 |

Body text owes 4.5:1. **The light theme failed at every level**, across a dozen captions, ancestry lines and
scope notes. It reads as "slightly quieter" in a class list and is a straightforward accessibility defect.

So `--color-base-content-muted`, stated by both themes and held to 4.5:1 against base-100, 200 _and_ 300 by
three new contract pairs. In light it is a genuine mute - 32% to 52% lightness. **In dark it is barely below
the foreground, and that is the honest answer rather than a fudge**: base-300 is light enough that anything
meaningfully dimmer fails against it, so muted text in the dark theme differs by size and weight rather than
by tone. The token exists in both because the contract requires the two themes to agree about what exists.

Badges keep their opacity. Fading one takes its own fill with it, so the contrast between its text and its
background is unchanged - and so do disabled controls, which WCAG exempts from the minimum and which dim
precisely to say they are unavailable.

**Both exemptions were found by the guard failing on honest code.** `mutedText.test.ts` flags any class that
sizes text and fades it; the first run named three disabled controls, and `text-base` was matching inside
`text-base-content`. Fixing the test rather than the components was the right way round, and is worth
recording as the failure mode of a heuristic guard.

### The roving cursor is gone (2026-09-14)

Built in step 7 for listings, extended to the toolbar with the accessibility work, and removed here at the
user's call: _"it is not standard to swap between tab and arrows and i bet very few would find this
behavior."_

That is the right read, and the implementation history backs it up. In two days it produced three distinct
faults, none of which any test or visual pass could see and all of which needed a keyboard to find:
non-focusable children counted as steps, the bubble phase losing arrows to a menu trigger, and disabled
controls silently swallowing focus. Each fix was correct and each revealed the next. A feature that costs that
much scrutiny should be paying for itself in discoverability, and this one cannot: nothing on screen says the
arrows have taken over, and Tab - the key a reader actually reaches for - starts behaving differently halfway
down the page.

`a11y/rovingFocus.ts` and the eleven listing keyboard tests are deleted, `keyboardCursor` is gone from five
call sites, and eight toolbar tests went with it. **`role="toolbar"` went too**, which is the part worth
saying out loud: that role _promises_ a single tab stop with arrow navigation, so keeping it after removing
the behaviour would tell a screen reader to press keys that do nothing. A wrong landmark is worse than no
landmark.

Browser defaults now. If there is a real problem here it can be looked at from a clean slate.

### The skeleton shimmer stops mid-sweep under reduced motion (2026-09-14)

§8 item 7 said the blanket rule was "already correct". It is not quite. Capping every animation at one
iteration of 0.01ms still _runs_ the shimmer, and with no fill mode it lands back at the element's own
`background-position: 0% 0%` - which parks a bright diagonal band across every placeholder and leaves it
there. A frozen highlight reads as a rendering fault rather than as something loading. Under reduced motion
the gradient is now dropped entirely and the tile is the flat tint it was always meant to settle into.

### The bulk-edit fold-in is dropped, not pending (2026-09-14)

Step 9 left one item open: §4 had the Inspector holding the two bulk cards, shown in place of the per-item
ones when Bulk Edit is the surface. Revisited, and the answer is that it should not be built.

**What it was for has already been delivered by other means.** The motivation was one panel instead of two -
`BulkEditSidebar` was a second copy of the Inspector's chrome, right down to a hard-coded `w-[500px]`. The
`SidePanel` extraction took care of that: both now render the same shell, and `BulkEditSidebar` is 66 lines
that name two cards.

**What is left would mean bending the registry around one screen.** Three concrete mismatches:

- `applicableCards` returns `[]` when there is no `context.media`. Bulk edit has no active media at all - it
  acts on a _selection_ - so the registry's own gate excludes it by construction.
- `InspectorCardProps` carries `{ activeCategory, activeMedia, mediaElement, requestMoveNext }`. The bulk
  cards need four callbacks into the view (`onSave`, `onSelectAll`, `onDeselectAll`, `onHideMediaWithGps`),
  which would either widen that contract for a single caller or need a context invented to smuggle them.
- The Inspector's value is _choosing_ which cards to show and carrying that choice between views. Bulk edit
  has exactly two cards and you want both, always. The rail toggle would be a control with one sensible
  position.

So the fold-in buys a shared registry for a screen whose model does not fit it, at the cost of loosening the
contract that makes the registry worth having. §4's "one place for everything about the focused item" still
holds - it is just that bulk edit's focused thing is a selection, and that really is a different shape, which
is what the step 9 note guessed when it deferred this in the first place.

### Fullscreen stops being a place you go (2026-09-14)

The same argument that deleted the detail view in step 9b, applied one view further along, and raised by the
user rather than found in the code: _"there isn't much value in maintaining a separate route for fullscreen
mode."_

A fullscreen route per area rendered the same photograph through the same `MainItem` the grid already
overlays it with, and then drew a toolbar and an inspector rail around it. So what fullscreen actually offered
was the **absence of everything else** - and that is a state a view can be in, not a destination to navigate
to. It is a toggle on the grid now, with one small button bottom-left to leave by.

**What went.** `ViewFullscreen`, three per-area `Fullscreen` pages, four route definitions, `MediaViewFullscreen`
from the model, and the fullscreen branch of three media services. `FullscreenRedirect` keeps the addresses
alive on the same substitution the detail view got - `/fullscreen/a-photo` to `/grid/a-photo`.

**And `_idleChrome` went with it**, which is the part worth noticing. That primitive existed to fade the
chrome after 2.5s because the fullscreen _view_ still had chrome to fade. Once fullscreen means "there is no
chrome", the whole idea - an idle timer, a hold while a pointer rests on it, a hold while focus is inside it -
has nothing to do. Roughly 120 lines of behaviour deleted because the thing it was compensating for stopped
existing.

**Three ways out, deliberately.** The button, `Esc`, and stepping back to the tiles - fullscreen turns itself
off when there is no active photograph, rather than leaving a black page with one control on it. The button is
bottom-left, away from the swipe that moves between photographs, because the toolbar that would normally offer
an exit is precisely what has been taken away. `f` toggles it and was the one free letter in the map; it is
the only key that names what it does, which is an accident rather than a scheme.

**A saved view of `fullscreen` falls back to the grid** with no new code: `sanitiseView` already tests
membership of `MediaViewAll`, and the migration's `migrateView` does the same. Two migration tests asserted
the old behaviour and were rewritten - and `ShortcutReference.test.ts` caught `f` being bound before it was
documented, which is exactly the drift it was written for.

### Three settings that were never designed (2026-09-14)

Asked what else I had noticed while working through this. Three of the answers were worth acting on, and the
first of them was mine to have caught earlier.

**A view switcher with one entry.** Removing fullscreen left Random and every feed offering the grid and
nothing else, so `NavGroup` drew a switch between a single option - a link to the page you are already on,
taking a slot in the bar and a digit with it. A group of fewer than two now draws nothing, and the media
toolbar's divider is conditional on there being view links to divide from.

**Density is gone.** It was never designed: the old application had a four-step thumbnail size _and_ a
four-step page margin, sixteen combinations of one idea, and three named steps was the compromise that
collapsed them in step 3. It cost a toolbar button, a shortcut, a settings row, a stored key and reactive
plumbing through `Tile`, `SkeletonGrid`, `CategoryListItem` and `Layout` - and only two of its three steps
produced distinct stage widths, which is the tell that the axis was not carrying real information. One
thumbnail size, one list size, one content width.

**Thumbnail dimming is gone**, and it was the worse of the two. It desaturated every thumbnail until you
hovered it and defaulted **on**, so a library of photographs showed them washed out until you pointed at one.
The hover emphasis the user wanted to keep is the lift and the primary-tinted shadow in `.elev-hover`, which
say the same thing without taking the colour away.

**What fell out with them.** `_models/Density.ts` and `_models/Margin.ts` deleted outright; both list
toolbars deleted, because density and dimming were the only controls a list view had; two migration helpers
and two migration tests removed with the keys they carried; `s` and `b` returned to the pool. `.stage` is one
number with a phone override rather than a class per step.

**The pattern worth naming**, since it is what connects all three and probably is not finished: nearly every
questionable control in this application is a _preference that exists because two older things were merged_,
not because anyone wanted a choice. The rework has been good at collapsing duplication and less good at
asking whether the survivor should exist at all. The test to apply is whether a setting earns its toolbar
button, its shortcut letter, its settings row and its stored key - and by that test `showBadges` is the next
one to look at, since the favourite heart it hides is the only way to favourite anything.

### The badge toggle goes, on its own argument (2026-09-15)

Flagged at the end of the density work as the next setting failing the "does it earn its keep" test, and
removed here. The argument was already written down inside `PersonCard`, which had been carrying an exception
since step 7: _the favourite heart is always offered there, because it is the only way to mark a person, so
hiding it behind a preference would hide the feature itself._

That reasoning does not stop at people. The heart is the only way to favourite **anything** - a category, a
photograph - so `showBadges` was a setting whose "off" position removed the sole route to a feature. It
already defaulted **on** for exactly that reason, which meant the preference existed to let somebody break
their own application and nothing else.

Gone: the state field, the context action, the toolbar button, the settings row, the migration note that
explained why it was not carried across, and the `<Show>` around every badge in `Tile`'s three callers and in
`MainItem`. `h` is free.

**The snapshot did not move**, which is the tell that this was dead weight rather than behaviour: badges
defaulted on, `<Show>` with a truthy condition renders no wrapper, so the markup is character-for-character
what it was.

That is three settings deleted in two days - density, thumbnail dimming, badges - and all three were the same
shape: **a preference nobody asked for, created by merging two older controls, whose default was the only
sensible value.** What is left in `ListingSettings` is `showLabels`, `highlightFaces` and `peopleSort`, and
those three are genuine choices with two defensible answers each.

### The hover highlight was leaving a comet-tail (2026-09-15)

Reported as the card highlight not being "very snappy" when moving quickly across many categories. Three
candidate causes, and measurement killed the first two.

**Not main-thread cost.** Driving a real cursor across 400 tiles through the DevTools protocol: 1.3ms of main
thread per move as shipped, 0.6ms with the shadow transition dropped. Real, halvable, and nowhere near enough
to be felt.

**Not hover flicker.** `transform: translateY(-2px)` moves the card, and transformed elements are hit-tested
where they are drawn - so a pointer in the bottom 2px could plausibly lift the card out from under itself and
oscillate. Parked the cursor 1px inside the bottom edge and sampled the hovered-card count fourteen times: a
flat `1` throughout. Disproved.

**It was the trail.** Counting how many cards carry a shadow _during_ a sweep gives the answer directly:

|                    | cards lit at once |
| ------------------ | ----------------- |
| as shipped         | **5**             |
| any variant tested | 1                 |

Five cards mid-fade behind the pointer does not read as five highlights. It reads as one highlight failing to
keep up, which is exactly the words used to report it.

**The fix is asymmetry, not speed.** A transition is governed by the state being moved _to_, so declaring it
on `:hover` rather than on the element gives arrival an animation and departure none. Verified by sampling
the computed transform: `none` at rest, mid-interpolation 20ms after entering, the full `-2px` once settled,
and `none` again the instant the pointer leaves. The considered fade when you rest on a card is kept; the tail
is gone.

`filter` came out of the transition list while in there - it was for the thumbnail desaturation, which no
longer exists.

**Guarded, because the fix looks like a mistake.** The obvious tidy-up is to hoist the transition onto the
element "where it belongs", and that silently restores the tail. `motion.test.ts` fails if the base rule
declares anything but `transition-property: none`.

### Adjustments stop outliving their subject (2026-09-15)

A reversal of §10's answer from the day before, and worth recording as one rather than quietly changed. Asked
then whether visual effects should survive moving between photographs, the answer was yes, and the code
already did it. Raised again while weighing whether to cut the filter sliders, the answer went the other way.

**The sliders stay.** They were on my list as a toy - sepia and hue-rotate on somebody else's photographs -
and that was the wrong read of who this is for. Grayscale and sepia answer "would this look better as one",
and hue-rotate turns out to pull edge detail out of awkward scenes. A tool used rarely by one person is still
a tool.

**What was actually wrong was the persistence.** A rotation is the clearest case: you turn a sideways
photograph the right way up, step to the next one, and that one is lying on its side for no reason visible on
screen. The filters are the same fault more quietly - a sepia left on recolours everything you look at
afterwards, and the control that undoes it is inside a card you may not have open. The effect outlives the
thing it was applied to, and nothing says so.

`useResetEffectsOnMediaChange` is `createEffect(on(subject, reset, { defer: true }))` - deferred, so arriving
at the first photograph is not treated as a change. `MainItem` owns the call, being the thing that is
adjusted. `reset` stays: this is about adjustments not outliving their subject, not about removing the way to
clear them deliberately.

### Histogram and MiniMap stay, and my case against MiniMap was wrong (2026-09-15)

The last two candidates from the simplification review, both kept.

**Histogram** earns its place when reviewing photographs, which is a use I had discounted on the grounds that
most viewers will not read one. Most viewers is not the measure for this application.

**MiniMap** I argued against on the grounds that it shows a single marker for a photograph you can already see
on the Map view. That was wrong twice over. It misses the point of the card - the Map view shows a
_thumbnail_ on a map by design, while the Inspector shows where you are standing beside the **full-size**
image, which is a different question being answered. And the duplication I was worried about cannot happen:
`registry.ts` has carried `appliesTo: context => context.view !== MediaViewMap` since step 9, with a test
named "the minimap stands aside on the map, where it would say the same thing twice". I had read that code,
written about it, and still raised the objection it exists to answer.

Worth recording as the shape of the error rather than the instance: **an argument from "who would use this"
is weak in an application with one user who can simply tell you.** Three of the five candidates in that review
were right to cut - density, dimming, badges - and every one of those was justified by something structural
(a setting salvaged from two older controls, a default that was the only sensible value, a preference that
could hide the sole route to a feature). The two I got wrong were both justified by my guess at what somebody
would want.

With these settled, every item from the simplification review is closed and nothing remains on the
implementation side. What is left in §10 are two genuine design questions: a keyboard scheme for the primary
navigation, and what a "stat" is in this application.

### Three directories holding one line each (2026-09-15)

Raised by the user about `person/` and `place/`; there were three, because `clan/` is the same shape.

Each was a top-level directory containing a single `_routes.ts` whose only real content was one call to
`buildFeedRouteTree`. And every one of their base paths already lived _inside_ an area that has its own
directory:

```
personFeedBasePath → /people/{id}
clanFeedBasePath   → /people/clans/{id}
placeFeedBasePath  → /places/{id}/media
```

**The concern was already split.** `people/_routes.ts` exported `getPersonPath` → `/people/{id}`, the exact
path `person/_routes.ts` built a route tree for. Same on the other side: `getPlacePath` in `places/`,
`placeMediaRoutes` in `place/`. So "what is a person's URL" and "what hangs off it" lived in two directories
whose names differ by one letter - which is a thing you stop and parse every time you read the tree.

**The one thing that could have justified it was a cycle**, and there is none: `_media/feed/_routes.ts`
imports only `solid-js` and `_models`. Files like `feed/Redirect.tsx` do import `people/_routes`, but they are
reached through `lazy()`, so there is no static back-edge.

`src/` goes from twenty entries to seventeen and stops reading as areas-plus-fragments-of-areas. `ClanCard`
now reaches for `getClanPath` as a sibling rather than across the top level.

**What is lost, and why it is worth losing.** Singular versus plural did encode something real - one subject's
feed against the listing of subjects. That distinction survives as two exports in one file, which is where it
reads better than as two directories one letter apart.

### Deliberately deferred from step 1

`.stage` and `.tile` were listed in step 1 but have no consumer until the density work (step 8) and `Tile`
(step 7). Defining them now would add exactly the kind of CSS that emits and matches nothing which step 0
just finished removing, so they land with the components that use them. `MediaLink` keeps its own copy of the
hover utilities for the same reason — it is conditional on a prop that only the filmstrip sets, and the
filmstrip is deleted in step 9b.

## 7. Unified shortcut map

> **DECIDED 2026-09-14 — the letter reassignment below is not being carried out.** The tables are kept as a
> record of what was proposed. §7's stated goal was "no letter has two meanings", and that goal was _met_ -
> steps 8 and 9 reached it by consolidating the controls instead of renaming the keys, and the dev-mode
> collision guard proves it on every startup. What is left of this section is mnemonic tidiness, and the cost
> of it falls entirely on whoever has already learned `s` for density and `t` for labels. The map is now
> written down on a Settings page and checked against the source by `ShortcutReference.test.ts`, so it is
> documented rather than folklore. That is worth more than it being alphabetical.

**The structural idea: digits navigate, letters act.** Digits are assigned by _position in the navigation row_, once, inside `NavGroup` — so they cannot collide by construction, and a user learns one rule instead of twenty-two letters.

### Navigation — `1`–`9`, positional

| Surface                    | 1          | 2               | 3          | 4         | 5          |
| -------------------------- | ---------- | --------------- | ---------- | --------- | ---------- |
| Categories                 | Grid       | List            |            |           |            |
| Search                     | Grid       | List            |            |           |            |
| Category media             | Grid       | Detail          | Fullscreen | Map       | Bulk Edit  |
| Random media               | Grid       | Detail          | Fullscreen |           |            |
| Person / clan / place feed | Media      | Categories      | Grid       | Detail    | Fullscreen |
| Places                     | Media here | Categories here |            |           |            |
| About                      | Help       | Release Notes   | Android    |           |            |
| Settings                   | Appearance | Browsing        | Media      | Shortcuts |            |

Replaces today's `g`, `w`, `f`, `z`, `/`, `k`, `p`(places media), `l`(categories list) — eight letters returned, and `f` stops meaning both "Fullscreen" and nothing-else-available.

### Actions — one meaning, app-wide

| Key     | Action                               | Scope                                                       |
| ------- | ------------------------------------ | ----------------------------------------------------------- |
| `←` `→` | Previous / next item                 | any surface with a focused item                             |
| `p`     | Play / pause slideshow               | Grid, Detail, Fullscreen, **Map** (new)                     |
| `h`     | Favourite the focused item           | everywhere _(was: toggle the badge)_                        |
| `i`     | Open / close the Inspector           | everywhere                                                  |
| `[` `]` | Rotate counter-clockwise / clockwise | any media surface _(was `a` / `d`)_                         |
| `\`     | Flip horizontal (`Shift+\` vertical) | any media surface                                           |
| `d`     | Cycle density                        | any listing _(was `s` size + `m` margins)_                  |
| `l`     | Toggle labels                        | any listing _(was `t` titles / `y` years / names / counts)_ |
| `b`     | Toggle badges                        | any listing _(was `h` favourites + `e` types)_              |
| `q`     | Toggle face highlighting             | any media listing (unchanged)                               |
| `o`     | Cycle order / sort                   | People (unchanged)                                          |
| `r`     | Request more                         | any paged listing (unchanged)                               |
| `s`     | Focus the search / filter box        | Search, People, Places                                      |
| `f`     | Favourites-only filter               | feeds _(was `u`)_                                           |
| `x`     | Shuffle                              | media feeds _(was `j`)_                                     |
| `y`     | Year filter                          | Categories                                                  |
| `e`     | Edit mode                            | Places (admin) — now its **only** meaning                   |
| `a`     | Select all (`Shift+a` clear)         | Bulk Edit, People picking                                   |
| `t`     | Cycle theme                          | global (new)                                                |
| `n`     | Toggle navigation rail               | global (new)                                                |
| `u`     | Toggle toolbar labels                | global (new)                                                |
| `,`     | Open Settings                        | global (new)                                                |
| `?`     | Shortcut reference                   | global (unchanged)                                          |

No letter has two meanings. `c`, `g`, `j`, `k`, `m`, `v`, `w`, `z` are unassigned — deliberate headroom.

### Enforcement

- `ShortcutContext` gains a dev-mode assertion: registering a key already held by a _different_ description throws in `import.meta.env.DEV`. The collisions the brief describes become build-time failures.
- **Shortcuts stop firing while focus is in a text field.** Today `SearchBar.tsx:17`, `PersonFilterBar.tsx:22` and `PlaceSearchBar.tsx:48` each hand-roll `evt.stopPropagation()` to work around this. The check belongs in `ShortcutWrapper` (`if (isEditableTarget(document.activeElement)) return;`); the three workarounds get deleted.
- `ShortcutDialog` de-duplicates by `(keys, description)` — it currently lists the same key once per registering component.
- `getNameWithShortcut` in `_components/shortcuts/_util.ts` keeps working; it gains digit formatting.

---

## 8. Responsive and accessibility plan

### Small screens get everything except Bulk Edit

| Today                                                                   | Target                                                                                            |
| ----------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| `<md`: only Grid in the view switcher (`Toolbar.tsx:69`)                | All views; Detail drops the filmstrip, Map and Fullscreen work as-is                              |
| `<md`: toolbar is a horizontal strip, all buttons, no wrapping strategy | Bottom bar: segmented nav row + 4 verbs + `⋮`; the rest in an overflow sheet                      |
| Inspector: `w-[500px]`, never mounted below Detail                      | Bottom sheet at `70dvh`, one card at a time, swipe to dismiss                                     |
| Margins `mx-[8%]` waste 16% of a 390px screen                           | `.stage` at `min(100%, --stage-width)` — full width on phones                                     |
| `MediaBreakpointContext` tracks only `md`                               | Add `lg` (the slots are already there, commented out) for the Inspector's docked/overlay decision |
| Grid prev/next hidden below `md`                                        | Shown; swipe already works via `_directives/Swipe.ts`                                             |
| Fullscreen keeps permanent chrome                                       | Chrome auto-hides after 2.5s idle, returns on movement                                            |

### Accessibility, in the order I would fix it

1. **Focus visibility.** There is currently none. Add once, in `@layer base`:
   `:focus-visible { outline: 2px solid var(--color-primary); outline-offset: 2px; border-radius: var(--radius-field); }` — and give `Tile` `.elev-hover` on `:focus-visible` so keyboard navigation of a grid is as legible as hovering it.
2. **DONE 2026-09-14 — accessible names on icon-only controls.** `ToolbarButton`, `ToolbarLink`, `SidebarButton`, `IconButton` and `ToolbarDownloadLink` all rely on `title`, which is invisible on touch and unreliable across AT. Make `label` a required prop rendering `aria-label`; keep `title` for the pointer tooltip. `IconButton` currently takes no label at all, and it is what renders the favourite heart on every tile.
3. **DONE 2026-09-14 — toggle and nav semantics.** `aria-pressed` on every toolbar toggle (there are ~30 with `active`), `aria-current="page"` on `PrimaryNavLink` and `NavGroup` links, `<nav aria-label="Primary">` around `PrimaryNav` (currently a bare `<div>`), `role="toolbar"` + arrow-key roving tabindex on `ToolbarLayout` so a toolbar is one tab stop rather than fifteen.
4. **DONE 2026-09-14 — images.** 15 of 22 `<img>` lack `alt`. Decorative thumbnails inside a labelled link get `alt=""`; the link carries the name. `ViewBulkEdit`'s tiles and `MediaLink`'s thumbnail are the main offenders.
5. **The Inspector as a landmark.** `role="complementary"` when docked, `role="dialog" aria-modal="false"` when overlaid, focus trap only in the `<md` sheet, `Esc` closes it in overlay and sheet modes.
6. **DONE 2026-09-14 — contrast.** Enforced by the theme test in §6. `PlaceCard`'s `text-xs opacity-70` ancestry line and `text-base-content/40` placeholders are the ones I expect to fail first.
7. **Reduced motion.** Already correct — the global kill switch in `index.css` is a good pattern and stays. One addition: `.skeleton-tile`'s infinite shimmer should become a static tint under reduced motion rather than a 0.01ms infinite animation.
8. **REVERTED 2026-09-14 — keyboard reachability of listings.** `ListingSurface` was given a roving-tabindex cursor, and it has been taken back out; see the note below. Listings are ordinary tab stops again.

---

## 9. Implementation roadmap

Fourteen steps. Each is independently shippable, leaves the app working, and passes `bun run typecheck && bun run lint && bun run test`. Shared primitives land before their consumers.

| #       | Step                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        | Scope             | Risk   |
| ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------- | ------ |
| **0**   | **DONE 2026-09-11 — hygiene, no behaviour change.** Dropped the 5 dead `.scrollable` uses; fixed `mr[-1px]`, `border-l-base-content:30%`, `flex-items-center`; replaced 9 `text-6` with `text-2xl` (the tenth was a real `text-6xl`); renamed the two components misnamed `Select` to `Toggle` / `Checkbox`; removed the dead `horizontal` prop chain and the hardcoded `name="theme"`; renamed `isToolbarCollapsed` → `showToolbarLabels` with a legacy read; added the missing loading states to `search/Grid.tsx` and `search/List.tsx`. | 27 files          | none   |
| **1**   | **DONE 2026-09-12 — visual system.** Type scale (`--text-display/title/label/body/meta`) and motion tokens in `@theme`; `head1/2/3` rebuilt on the scale; `.icon-sm`/`.icon-md` replacing the step-0 `text-2xl` stopgap; `.elev-hover`/`.elev-overlay` with the hover treatment now applying on `:focus-visible`; the app's first focus ring; body set to the body step; fonts self-hosted via `@fontsource` and the Google Fonts `<link>` + preconnects removed; `_contract.ts` + `theme.test.ts` (49 assertions).                         | 20 files, +2 deps | low    |
| **2**   | **DONE 2026-09-12 — icon consolidation.** 52 references rewritten across 34 files; the app now draws from `ic--round-*` only, down from six vocabularies. `@iconify-json/mdi` removed. An eslint `no-restricted-syntax` rule (covering both string literals and template elements, so `.ts` route definitions are caught too) rejects a seventh. All 82 unique icons verified present in the production CSS.                                                                                                                                | 34 files, −1 dep  | low    |
| **3**   | **DONE 2026-09-12 — the four stores.** 16 settings keys become 4; 15 of the old contexts are now adapters that own nothing, so no screen had to change. `_migrate.ts` carries the legacy keys across without deleting them. `AllSettingsProvider` goes from 18 providers to 4. Theme gains `system` (decision 13), including the pre-mount script. 41 tests: migration fixtures plus a runtime pass over the adapters.                                                                                                                      | 40 files          | done   |
| **4**   | **DONE 2026-09-12 — states.** `AsyncBoundary` now answers loading / failed / empty / loaded for **20 screens** that each hand-rolled it; `EmptyState` replaces nine inline `<p class="text-center my-8">` variants; `SkeletonChart` replaces the spinner in stats, and `stats/Year` gains the loading state it never had. `EmptyClanMessage` is now three props. 16 new tests.                                                                                                                                                              | 28 files          | low    |
| **5**   | **DONE 2026-09-12 — dialogs, and Kobalte lands.** `@kobalte/core` added; `overlay/Dialog` and `overlay/ConfirmDialog` replace five hand-rolled `<dialog class="modal">` implementations and `ClanDeleteDialog` is deleted. `isEditableTarget` moves the shortcut guard into `ShortcutWrapper`, removing five per-input `stopPropagation` workarounds. 10 new tests.                                                                                                                                                                         | 13 files, +1 dep  | low    |
| **6**   | **DONE 2026-09-12 — NavGroup and the digits.** Seven hand-rolled nav rows become one component; navigation is keyed `1`-`9` by position and the twelve mnemonic `shortcutKeys` in the route definitions are deleted. `ToolbarLink` is now reachable only through `NavGroup`, so every nav link is numbered by construction. 5 new tests.                                                                                                                                                                                                    | 17 files          | low    |
| **7**   | **DONE 2026-09-13 — one tile.** `createImageReveal` and `FavoriteBadge` came out byte-identically; `ListingSurface` replaced six hand-written containers and brought **arrow-key movement to listings that had none**; then `Tile` absorbed the category, person and media tiles. It **sizes itself from the density**, which is what unblocked step 14. `Row` was not needed: only one list item was left. 7 tests, snapshots read as a diff.                                                                                              | 24 files          | medium |
| **8**   | **DONE 2026-09-12 — `ListingToolbar`.** Nine toolbars' worth of density/label/badge/dim/faces/sort controls become one component reading the one store; three one-off button files deleted, and the dead badge-setter threading unwound through the views and screens. −451 lines. 5 new tests.                                                                                                                                                                                                                                             | 24 files          | medium |
| **9**   | **DONE 2026-09-13 — the Inspector.** `Sidebar` becomes `Inspector` + a registry with `appliesTo()`, mounted in **grid, detail, fullscreen and map**. Card letters removed, `i` opens it, and the dev-mode collision guard is in - **zero keys now carry two meanings**. Rotate and flip moved into the _Adjust_ card, beside the sliders they already shared a reset with, leaving their keys registered in the toolbar. The bulk-edit fold-in is **dropped** rather than pending — see below. 10 new tests.                                | 17 files          | high   |
| **9b**  | **DONE 2026-09-13 — the Detail view is gone.** 7 files deleted, `/detail/*` redirects to `/grid/*` in all three areas, the saved view is mapped on both the migration and the load path, and the filmstrip goes with it. −613 lines.                                                                                                                                                                                                                                                                                                        | 23 files          | done   |
| **10**  | **DONE 2026-09-13 — `ItemActions`.** Downloads and share, which step 9b had orphaned, return as a `⋮` menu on Kobalte's `DropdownMenu`, in the shared media toolbar so every view has them. 6 files deleted. An orphan check now fails the suite on unreachable modules.                                                                                                                                                                                                                                                                    | 10 files          | medium |
| **11**  | **DONE 2026-09-13 — `MediaToolbar`.** Three view toolbars become one that derives everything from the service and the view; ~10 props per call site become 4. The map gains a slideshow. −200 lines.                                                                                                                                                                                                                                                                                                                                        | 11 files          | medium |
| **12**  | **DONE 2026-09-13 — responsive.** The `gteMd` view gate is gone, so a phone is offered every view but bulk edit, rather than the grid alone. The chrome moves to the bottom and folds everything past navigation into a sheet; the Inspector gains three shapes (docked / overlay / sheet) on a new `lg` breakpoint; `.stage` replaces the four `mx-[N%]` margins and is ignored below `md`; prev/next show at every width; fullscreen's chrome steps back when the reader goes still. 17 new tests.                                        | 19 files          | medium |
| **12b** | **DONE 2026-09-13 — view transitions.** One `useBeforeLeave` hook wraps navigation in `startViewTransition`; the main photograph carries a `view-transition-name`, so it tweens between grid and fullscreen instead of being torn down and rebuilt. Guarded on support, on `prefers-reduced-motion`, and on a navigation somebody else has claimed. 4 tests.                                                                                                                                                                                | 5 files           | low    |
| **13**  | **DONE 2026-09-13 — settings on the stores.** The four pages read the real stores, and the Media page's eight inspector checkboxes come from the registry rather than being listed again. A Shortcuts page documents the scheme the `?` dialog cannot - and is checked against the source, which is what caught §7's letter map never having been implemented. 3 new tests.                                                                                                                                                                 | 8 files           | low    |
| **14**  | **DONE 2026-09-13 — every adapter gone.** All fifteen are removed and their consumers read the four stores directly. `Layout`, `SkeletonGrid`, `CategoryListItem` and `Tile` now take the density and work out their own margin and pixels, which is what the last eight adapters existed to do for them. Nine dead model exports pruned with them.                                                                                                                                                                                         | 45 files          | medium |

Steps 0–2 are safe to land in any order and are worth doing immediately regardless of whether the rest proceeds. Step 3 is the keystone: everything from 7 onward is deletion enabled by it.

**Accounting.** Roughly 35 files deleted, 18 created, ~16 storage keys → 4, ~30 toolbar controls → ~11, 22 shortcut letters → 9 digits + 22 non-colliding letters with 8 spare.

---

## 10. Open questions

**Deletions that need a veto.** Each of these is a real capability going away; I recommend all of them, and any one can be kept without disturbing the rest.

1. **Dim thumbnails.** Fixed desaturate-until-hover instead of a toggle. Eight stores, eight buttons, every one lit-when-false.
2. **Margins as a user control.** Replaced by the stage width, folded into Density. If you use `cozy` (24% gutters) deliberately on a wide monitor, say so and Density gains a fourth step rather than three.
3. **Thumbnail size's four steps → three density steps.** `tiny` (40×30) disappears. Was it ever used?
4. **Breadcrumb toggles, all three.** Always visible in grid and detail, never in fullscreen.
5. **The filmstrip toggle** (`l` in Detail). Filmstrip stays, toggle goes, auto-hidden below `md`.
6. **Badges default to ON.** The favourite heart currently defaults to invisible — I read that as an accident, but it is a visible default change for every existing user.
7. **The eight sidebar-card letters** (`c,x,e,o,v,n,k,y`). See §2 for the trade-off and the `Shift+` fallback.
8. **Persisting the category year filter.** URL only.

**Design choices I made where the alternative was defensible:**

9. **Digits for navigation.** The alternative is keeping mnemonic letters (`g`rid, `d`etail, `f`ullscreen, `m`ap) and accepting that they collide with actions in at least four areas, and that a feed's five-item nav row needs five mnemonics that don't clash with its own filters. I chose positional digits because the rule is learnable once and collisions become impossible rather than merely fixed. If you'd rather keep letters, `NavGroup` can take an explicit key per route — the structure survives, the guarantee doesn't.

10. **The grid's focused item drives the Inspector, rather than the grid getting a hover-preview.** The grid already has an "active media" concept that renders an enlarged copy pinned bottom-right (`ViewGrid.tsx:118-150`). I'm reusing it as _the_ focus. The alternative — a separate hover-inspect that doesn't disturb the active item — is more forgiving with a mouse and useless with a keyboard. I chose focus.

11. **Bulk Edit stays `md`+ and admin-only.** The only feature I am deliberately not making responsive.

**Genuine unknowns I could not resolve from the code:**

12. **ANSWERED 2026-09-14 — keep it.** Does anyone use `ic--android` / the About → Android page? It's a nav row entry costing a digit. Not proposing removal, just asking.

13. **ANSWERED 2026-09-14 — yes, and it already is.** `defaultTheme` became `ThemeSystem` with the theme-toggle fix in step 3, and the pre-mount script resolves anything that is not an explicit `light`/`dark` against `prefers-color-scheme`. No change needed. Should `theme: "system"` be the new default for fresh users? The pre-mount script in `index.html` pins `data-theme`, so adding `system` means that script needs to read `prefers-color-scheme` too. Small change, but it touches the no-flash path.

14. **ANSWERED 2026-09-14, REVERSED 2026-09-15 — they now reset when the photograph changes; see the note below.** The original answer was that effects must _not_ reset. Nothing calls `reset` on item change, so a rotation persists across moves within a media root and clears on leaving it. No change needed. Is `VisualEffectsContext` expected to survive navigation within a media root? It is provided at `MediaRoot`, so a rotation applied to one photo persists across moves within a category but resets when you leave. Moving rotate/flip into the Inspector makes that lifetime more visible, and it may want an explicit "reset on item change" — `EffectsResetButton.tsx` exists but is only inside the Effects card.

15. **The primary navigation has no keys at all.** Found while deciding the above: `PrimaryNavLink` registers
    no shortcut, so Categories, People, Places, Search, Random, Stats, About and Settings are reachable only
    by Tab or by pointer. The `1`-`9` digits are positional _within an area's toolbar_, not across areas, so
    there is no keyboard route between areas. Deliberately left alone rather than patched with a single `,`
    for Settings, which would beg the question of why Settings and not Search. If it is worth solving it wants
    one scheme for all eight - a modifier and a digit, most likely - and that is a design decision rather than
    a fix.

16. **Stats** is the one area with no listing, no items and no preferences — its toolbar is pure URL state. I'm leaving it structurally alone beyond `NavGroup`, `SegmentedControl` and `SkeletonChart`. If you want stats to feel part of the same system rather than merely consistent with it, that's a separate conversation about what a stat _is_ in this app.

---

### Critical files for implementation

- `src/_contexts/settings/_storage.ts` — the migration and the four new keys land here first; everything in §5 depends on it
- `src/_media/detail/Sidebar.tsx` — the card registry and `appliesTo()` model come out of this file; it becomes `inspector/Inspector.tsx` + `inspector/registry.ts`
- `src/_media/ToolbarGrid.tsx` — the canonical copy of the density/label/badge block that `listing/ListingToolbar.tsx` replaces in eight places
- `src/_components/layout/Layout.tsx` — owns the toolbar/content/sidebar grid, the margin application and the stage backdrop; the responsive bottom bar, `.stage` and the Inspector's three presentations all attach here
- `src/index.css` — the type scale, spacing rhythm, `.tile`, `.elev-*`, motion tokens and the focus ring; also where the four dead utility classes are resolved

---

## 11. Tooling assessment — styling framework and dependencies

Asked directly: should the app move to a different styling framework to look beautiful? **No.** One dependency is worth adding, two cheap wins are worth taking, and one tempting direction is explicitly ruled out.

### Keep Tailwind 4 + daisyUI

Measured, counting only class tokens inside string literals: ~300 daisyUI class occurrences across ~40 files, dominated by `btn` (150 occurrences, 30 files), then `input` (28), `range` (24), `modal` (18), `badge` (16), `radio` (12). The deeper dependency is not those classes though — it is the **token layer**. Both `src/_themes/light.css` and `dark.css` are written in daisyUI's semantic tokens, and essentially every colour in the application resolves through `base-100/200/300`, `base-content`, `primary` and `primary-content`. Replacing daisyUI means re-authoring both themes and every colour reference in the app.

More to the point, the framework is not the cause. §0 and §6 already located the reasons this app does not feel designed: ~83 ad-hoc `text-*` utilities applied at call sites instead of a type scale, six icon vocabularies, five class names that emit no CSS at all, zero focus styling anywhere, and two themes that declare 8–9 tokens and let the rest be derived. Panda, vanilla-extract, UnoCSS or CSS modules would fix none of those. A framework migration here is the kind of change that looks like progress, costs a rewrite of every component, collides with a roadmap already deleting ~35 files, and produces nothing a user can see.

### Add `@kobalte/core`

Version 0.13.14, published 2026-09-07, peer `solid-js ^1.9.8` against this project's `^1.9.15`. Unstyled Solid-native primitives — the Radix equivalent — so it composes with Tailwind and daisyUI instead of displacing them.

The case is that §4's hand-rolled list is Kobalte's catalogue:

| §4 component                                | Kobalte primitive                              | Lands in step |
| ------------------------------------------- | ---------------------------------------------- | ------------- |
| `overlay/Dialog.tsx`, `ConfirmDialog.tsx`   | `Dialog`, `AlertDialog`                        | 5             |
| `input/Switch.tsx`                          | `Switch`                                       | 14            |
| `input/Select.tsx`                          | `Select`                                       | 14            |
| `input/RadioGroup.tsx`                      | `RadioGroup`                                   | 14            |
| `input/SegmentedControl.tsx`                | `ToggleGroup`                                  | 13            |
| `listing/ItemActions.tsx` (the `⋮` menu)    | `DropdownMenu`                                 | 10            |
| `toolbar/ToolbarLayout.tsx` roving tabindex | ~~`Toolbar`~~ — no such primitive; hand-rolled | 8             |
| Inspector overlay / bottom sheet            | `Popover` / `Dialog`                           | 12            |

§8's accessibility findings are exactly the class of work this removes: focus traps, roving tabindex, `aria-*` wiring, escape-to-dismiss, scroll locking. Five ARIA attributes in the entire codebase is reasonable evidence that hand-rolling this has not been going well. Roughly 8 of the 18 new components in §4 become thin styled wrappers rather than from-scratch implementations — net one dependency, net less hand-written accessibility code.

Alternatives weighed: **Ark UI Solid** (5.39.1, also actively maintained, Zag-based — more machinery than this app needs) and **Corvu** (last published January 2025; not worth the staleness risk).

### Self-host the fonts

`index.html` pulls Nunito Sans and Tangerine from Google Fonts through a render-blocking `<link>` plus two `preconnect`s on every cold load. `@fontsource` / `@fontsource-variable` removes the third-party round trip and the external point of failure. Worth doing in step 1 alongside the type scale — and since typeface is arguably the highest-leverage single decision in "beautiful", worth deliberately _choosing_ Nunito Sans at that moment rather than continuing to inherit it.

### View Transitions (step 12b)

Use the native View Transitions API so a thumbnail morphs into the photograph on grid → active item and grid → fullscreen, rather than cutting. No dependency, a handful of `view-transition-name` assignments plus `document.startViewTransition` at the navigation boundary, and it is the largest perceived-polish gain available without touching the backend. Gate it on `prefers-reduced-motion` alongside the existing kill switch in `index.css`.

### Explicitly out of scope — justified layout and API changes

Considered and **excluded by decision**, recorded here so it is not rediscovered and re-proposed later.

`getMediaTeaserUrl` requests the `qqvg-fill` scale — a server-side crop-to-fill — and neither `Media` nor `MediaFile` carries width or height. An aspect-ratio-preserving justified-row layout (the Flickr / Google Photos treatment) would therefore require a new thumbnail scale or dimension metadata from the API. **We are not doing this, and we are not asking the backend for it.**

Practical consequence for the build: thumbnails stay uniform crops, so `listing/Tile.tsx` (§4) should assume a **fixed box** and does not need aspect-ratio handling, intrinsic sizing, or layout-shift mitigation for varying dimensions. That simplifies it — the `{ width, height, aspect }` props sketched in §4 collapse to the density-derived box size.
