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

### Deliberately deferred from step 1

`.stage` and `.tile` were listed in step 1 but have no consumer until the density work (step 8) and `Tile`
(step 7). Defining them now would add exactly the kind of CSS that emits and matches nothing which step 0
just finished removing, so they land with the components that use them. `MediaLink` keeps its own copy of the
hover utilities for the same reason — it is conditional on a prop that only the filmstrip sets, and the
filmstrip is deleted in step 9b.

## 7. Unified shortcut map

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
2. **Accessible names on icon-only controls.** `ToolbarButton`, `ToolbarLink`, `SidebarButton`, `IconButton` and `ToolbarDownloadLink` all rely on `title`, which is invisible on touch and unreliable across AT. Make `label` a required prop rendering `aria-label`; keep `title` for the pointer tooltip. `IconButton` currently takes no label at all, and it is what renders the favourite heart on every tile.
3. **Toggle and nav semantics.** `aria-pressed` on every toolbar toggle (there are ~30 with `active`), `aria-current="page"` on `PrimaryNavLink` and `NavGroup` links, `<nav aria-label="Primary">` around `PrimaryNav` (currently a bare `<div>`), `role="toolbar"` + arrow-key roving tabindex on `ToolbarLayout` so a toolbar is one tab stop rather than fifteen.
4. **Images.** 15 of 22 `<img>` lack `alt`. Decorative thumbnails inside a labelled link get `alt=""`; the link carries the name. `ViewBulkEdit`'s tiles and `MediaLink`'s thumbnail are the main offenders.
5. **The Inspector as a landmark.** `role="complementary"` when docked, `role="dialog" aria-modal="false"` when overlaid, focus trap only in the `<md` sheet, `Esc` closes it in overlay and sheet modes.
6. **Contrast.** Enforced by the theme test in §6. `PlaceCard`'s `text-xs opacity-70` ancestry line and `text-base-content/40` placeholders are the ones I expect to fail first.
7. **Reduced motion.** Already correct — the global kill switch in `index.css` is a good pattern and stays. One addition: `.skeleton-tile`'s infinite shimmer should become a static tint under reduced motion rather than a 0.01ms infinite animation.
8. **Keyboard reachability of listings.** `ListingSurface` gives every listing a roving-tabindex cursor with `←↑→↓`, `Home`/`End`, `Enter` to open, `h` to favourite, `i` to inspect. Categories, People and Places are not keyboard-navigable at all today.

---

## 9. Implementation roadmap

Fourteen steps. Each is independently shippable, leaves the app working, and passes `bun run typecheck && bun run lint && bun run test`. Shared primitives land before their consumers.

| #       | Step                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        | Scope                                   | Risk                       |
| ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------- | -------------------------- |
| **0**   | **DONE 2026-09-11 — hygiene, no behaviour change.** Dropped the 5 dead `.scrollable` uses; fixed `mr[-1px]`, `border-l-base-content:30%`, `flex-items-center`; replaced 9 `text-6` with `text-2xl` (the tenth was a real `text-6xl`); renamed the two components misnamed `Select` to `Toggle` / `Checkbox`; removed the dead `horizontal` prop chain and the hardcoded `name="theme"`; renamed `isToolbarCollapsed` → `showToolbarLabels` with a legacy read; added the missing loading states to `search/Grid.tsx` and `search/List.tsx`. | 27 files                                | none                       |
| **1**   | **DONE 2026-09-12 — visual system.** Type scale (`--text-display/title/label/body/meta`) and motion tokens in `@theme`; `head1/2/3` rebuilt on the scale; `.icon-sm`/`.icon-md` replacing the step-0 `text-2xl` stopgap; `.elev-hover`/`.elev-overlay` with the hover treatment now applying on `:focus-visible`; the app's first focus ring; body set to the body step; fonts self-hosted via `@fontsource` and the Google Fonts `<link>` + preconnects removed; `_contract.ts` + `theme.test.ts` (49 assertions).                         | 20 files, +2 deps                       | low                        |
| **2**   | **DONE 2026-09-12 — icon consolidation.** 52 references rewritten across 34 files; the app now draws from `ic--round-*` only, down from six vocabularies. `@iconify-json/mdi` removed. An eslint `no-restricted-syntax` rule (covering both string literals and template elements, so `.ts` route definitions are caught too) rejects a seventh. All 82 unique icons verified present in the production CSS.                                                                                                                                | 34 files, −1 dep                        | low                        |
| **3**   | **DONE 2026-09-12 — the four stores.** 16 settings keys become 4; 15 of the old contexts are now adapters that own nothing, so no screen had to change. `_migrate.ts` carries the legacy keys across without deleting them. `AllSettingsProvider` goes from 18 providers to 4. Theme gains `system` (decision 13), including the pre-mount script. 41 tests: migration fixtures plus a runtime pass over the adapters.                                                                                                                      | 40 files                                | done                       |
| **4**   | **DONE 2026-09-12 — states.** `AsyncBoundary` now answers loading / failed / empty / loaded for **20 screens** that each hand-rolled it; `EmptyState` replaces nine inline `<p class="text-center my-8">` variants; `SkeletonChart` replaces the spinner in stats, and `stats/Year` gains the loading state it never had. `EmptyClanMessage` is now three props. 16 new tests.                                                                                                                                                              | 28 files                                | low                        |
| **5**   | **DONE 2026-09-12 — dialogs, and Kobalte lands.** `@kobalte/core` added; `overlay/Dialog` and `overlay/ConfirmDialog` replace five hand-rolled `<dialog class="modal">` implementations and `ClanDeleteDialog` is deleted. `isEditableTarget` moves the shortcut guard into `ShortcutWrapper`, removing five per-input `stopPropagation` workarounds. 10 new tests.                                                                                                                                                                         | 13 files, +1 dep                        | low                        |
| **6**   | **DONE 2026-09-12 — NavGroup and the digits.** Seven hand-rolled nav rows become one component; navigation is keyed `1`-`9` by position and the twelve mnemonic `shortcutKeys` in the route definitions are deleted. `ToolbarLink` is now reachable only through `NavGroup`, so every nav link is numbered by construction. 5 new tests.                                                                                                                                                                                                    | 17 files                                | low                        |
| **7**   | **PARTIAL 2026-09-12 — the safe half.** The four tiles' markup is pinned by snapshot; the reveal machinery (`createImageReveal`) and the favourite badge are extracted, byte-identical, −89 lines. `Tile`, `Row`, `ListingSurface` and the keyboard cursor are **not** done: they change markup by design and need a browser.                                                                                                                                                                                                               | 9 files                                 | medium                     |
| **8**   | **`ListingToolbar`.** Delete the eight density/label/badge copies. Ships the letter half of the shortcut map, and removes dim/margins/size/titles/years/counts/badge-toggles.                                                                                                                                                                                                                                                                                                                                                               | 8 deletions                             | medium                     |
| **9**   | **Inspector.** Generalise `Sidebar` into `Inspector` + registry; mount in Grid, Fullscreen, Map; move rotate/flip into the _Adjust_ card; fold the bulk-edit cards in.                                                                                                                                                                                                                                                                                                                                                                      | `_media/detail/*`, `_media/bulk-edit/*` | **high — the payoff step** |
| **9b**  | **Delete the Detail view** (§0.5). Remove the six view/toolbar/service files, redirect `/detail/*` → `/grid/*`, migrate the saved view, shorten the nav rows, and teach grid's active-media overlay to share width with a docked Inspector.                                                                                                                                                                                                                                                                                                 | 12 files                                | medium — strictly after 9  |
| **10**  | **`ItemActions`.** `⋮` on the tile and in the toolbar; move downloads + share off Detail.                                                                                                                                                                                                                                                                                                                                                                                                                                                   | 5 files                                 | medium                     |
| **11**  | **`MediaToolbar`.** Collapse the five media toolbars into one capability-driven component; extend `IMediaService` with `capabilities()`.                                                                                                                                                                                                                                                                                                                                                                                                    | `_media/Toolbar*.tsx`                   | medium                     |
| **12**  | **Responsive.** Bottom bar + overflow sheet; Inspector sheet/overlay/docked; remove the `gteMd` view gate; `.stage` replaces margins; add `lg` to `MediaBreakpointContext`.                                                                                                                                                                                                                                                                                                                                                                 | ~10 files                               | medium                     |
| **12b** | **View Transitions.** Morph the thumbnail into the photo on grid → active item and grid → fullscreen, behind a `prefers-reduced-motion` guard. No dependency (§11).                                                                                                                                                                                                                                                                                                                                                                         | 3–4 files                               | low                        |
| **13**  | **Settings area from the registry.** Delete the four hand-written pages; add Appearance / Browsing / Media / Shortcuts.                                                                                                                                                                                                                                                                                                                                                                                                                     | `settings/*`                            | low                        |
| **14**  | **Remove the adapters** from step 3; delete the fifteen old context files; `Toggle`+`Checkbox`→`Switch`; `TextFilter` adoption.                                                                                                                                                                                                                                                                                                                                                                                                             | 20 deletions                            | low                        |

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

12. **Does anyone use `ic--android` / the About → Android page?** It's a nav row entry costing a digit. Not proposing removal, just asking.

13. **Should `theme: "system"` be the new default for fresh users?** The pre-mount script in `index.html` pins `data-theme`, so adding `system` means that script needs to read `prefers-color-scheme` too. Small change, but it touches the no-flash path.

14. **Is `VisualEffectsContext` expected to survive navigation within a media root?** It is provided at `MediaRoot`, so a rotation applied to one photo persists across moves within a category but resets when you leave. Moving rotate/flip into the Inspector makes that lifetime more visible, and it may want an explicit "reset on item change" — `EffectsResetButton.tsx` exists but is only inside the Effects card.

15. **Stats** is the one area with no listing, no items and no preferences — its toolbar is pure URL state. I'm leaving it structurally alone beyond `NavGroup`, `SegmentedControl` and `SkeletonChart`. If you want stats to feel part of the same system rather than merely consistent with it, that's a separate conversation about what a stat _is_ in this app.

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

| §4 component                                | Kobalte primitive       | Lands in step |
| ------------------------------------------- | ----------------------- | ------------- |
| `overlay/Dialog.tsx`, `ConfirmDialog.tsx`   | `Dialog`, `AlertDialog` | 5             |
| `input/Switch.tsx`                          | `Switch`                | 14            |
| `input/Select.tsx`                          | `Select`                | 14            |
| `input/RadioGroup.tsx`                      | `RadioGroup`            | 14            |
| `input/SegmentedControl.tsx`                | `ToggleGroup`           | 13            |
| `listing/ItemActions.tsx` (the `⋮` menu)    | `DropdownMenu`          | 10            |
| `toolbar/ToolbarLayout.tsx` roving tabindex | `Toolbar`               | 8             |
| Inspector overlay / bottom sheet            | `Popover` / `Dialog`    | 12            |

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
