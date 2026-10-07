import { Component, For, Show, createEffect, createSignal } from "solid-js";
import { useNavigate } from "@solidjs/router";

import { Media } from "../_models/Media";
import { GpsCoordinate } from "../_models/GpsCoordinate";
import { ThumbnailSizeDefault, getThumbnailSize } from "../_models/ThumbnailSize";
import { MediaViewGrid } from "../_models/MediaView";
import { Uuid } from "../_models/Uuid";
import { getMediaTeaserUrl } from "../_models/utils/MediaUtils";
import { IMapsMediaService } from "./services/IMapsMediaService";
import { useMediaContext } from "../_contexts/api/MediaContext";
import { describeError } from "../_contexts/api/ApiError";
import {
    MediaRestrictionProblem,
    describeRestrictionProblem,
    getRestrictionProblems
} from "../_models/MediaRestrictionProblem";
import { RestrictedMedia } from "../_models/RestrictedMedia";
import { AdminRole, excludesAdmin } from "./access/_restriction";

import Toolbar from "./Toolbar";
import Layout from "../_components/layout/Layout";
import CategoryBreadcrumb from "../_components/categories/CategoryBreadcrumb";
import BulkEditSidebar from "./bulk-edit/BulkEditSidebar";
import { BulkEditFilter } from "./bulk-edit/BulkEditFilterCard";
import ConfirmDialog from "../_components/overlay/ConfirmDialog";
import AdminGuard from "../_components/auth/AdminGuard";
import Icon from "../_components/icon/Icon";
import { usePanelShape } from "../_components/overlay/SidePanel";

/*
   A photo on offer for selection. Most come from the category's media; a photo
   restricted to roles this admin does not hold is not among those - it is
   hidden from them like anyone else - so it comes from the restrictions list
   instead, with no image to show, since /assets would refuse it.
*/
interface SelectableMedia {
    id: Uuid;
    isSelected: boolean;
    imageUrl: string | undefined;
    slug: string;
    isHiddenFromYou: boolean;
}

interface Props {
    mediaService: IMapsMediaService;
}

const ViewBulkEdit: Component<Props> = props => {
    const {
        bulkGpsOverrideMutation,
        bulkClearGpsOverrideMutation,
        rolesQuery,
        categoryRestrictionsQuery,
        bulkSetMediaRolesMutation,
        bulkClearMediaRolesMutation
    } = useMediaContext(); // todo: add to service
    const roles = rolesQuery();
    const activeCategoryId = () => props.mediaService.getActiveCategory()?.id;
    // eslint-disable-next-line solid/reactivity -- an accessor handed to a query factory, which reads it inside its own tracked options
    const restrictions = categoryRestrictionsQuery(activeCategoryId);
    const { docked } = usePanelShape();
    const navigate = useNavigate();

    /*
       The one view that is not offered on a narrow screen.

       Everything here is "pick photographs, then type one set of coordinates
       for all of them", which means having the selection and the form in view
       at once. Where the panel cannot dock it comes over the grid instead, so
       entering a location means covering the very thing you chose it for.

       The toolbar stops offering it, and this catches the rest: a bookmarked
       URL, a link from elsewhere, or a window dragged narrower while it is
       open. Same shape as the AdminGuard above it - leave, rather than render
       something that cannot do its job.
    */
    createEffect(() => {
        if (!docked()) {
            navigate(props.mediaService.getEntryPathByView(MediaViewGrid), { replace: true });
        }
    });
    const [media, setMedia] = createSignal<SelectableMedia[]>([]);
    const [filter, setFilter] = createSignal<BulkEditFilter>("all");
    const [isConfirmingClear, setIsConfirmingClear] = createSignal(false);
    // the roles waiting on an answer to "hide these from admins?"
    const [pendingLockoutRoles, setPendingLockoutRoles] = createSignal<string[]>();
    const [isConfirmingUnrestrict, setIsConfirmingUnrestrict] = createSignal(false);

    const buildSelectableMedia = (media: Media, isSelected: boolean): SelectableMedia => ({
        id: media.id,
        imageUrl: getMediaTeaserUrl(media)!,
        slug: media.slug,
        isHiddenFromYou: false,
        isSelected
    });

    const buildHiddenMedia = (
        restricted: RestrictedMedia,
        isSelected: boolean
    ): SelectableMedia => ({
        id: restricted.mediaId,
        imageUrl: undefined,
        slug: restricted.mediaSlug,
        isHiddenFromYou: true,
        isSelected
    });

    // the restriction on each restricted photo here, for the badges and the filter
    const restrictionById = () =>
        new Map((restrictions.data ?? []).map(r => [r.mediaId, r] as const));

    const hiddenCount = () => (restrictions.data ?? []).filter(r => !r.isVisibleToYou).length;
    const onSave = async (gps: GpsCoordinate) => {
        const mediaToUpdate = media()
            .filter(p => p.isSelected)
            .map(x => x.id);

        // assume success - make sure photos that may be removed from view are not still tracked as
        // participating in a future edit
        setAll(false);

        await bulkGpsOverrideMutation.mutateAsync({
            mediaIds: mediaToUpdate,
            gpsCoordinate: gps
        });
    };

    const selectedIds = () =>
        media()
            .filter(m => m.isSelected)
            .map(m => m.id);

    const onConfirmClearOverride = async () => {
        const mediaToClear = selectedIds();

        // as with a save: the cleared photos may leave the "with an override" view
        setAll(false);
        setIsConfirmingClear(false);

        await bulkClearGpsOverrideMutation.mutateAsync({ mediaIds: mediaToClear });
    };

    /*
       Unlike a gps save, the selection is kept until the server agrees: a
       restriction is all or nothing, and a refused one comes back naming each
       photo that stopped it. Those are marked in the grid, so the admin can
       deselect them - or go change the teaser - and try again with the rest
       still chosen.
    */
    const restrict = (roles: string[]) => {
        setPendingLockoutRoles(undefined);
        bulkClearMediaRolesMutation.reset();

        bulkSetMediaRolesMutation.mutate(
            { mediaIds: selectedIds(), roles },
            { onSuccess: () => setAll(false) }
        );
    };

    const onRestrict = (roles: string[]) => {
        if (excludesAdmin(roles)) {
            setPendingLockoutRoles(roles);
        } else {
            restrict(roles);
        }
    };

    const onConfirmUnrestrict = () => {
        setIsConfirmingUnrestrict(false);
        bulkSetMediaRolesMutation.reset();

        bulkClearMediaRolesMutation.mutate(
            { mediaIds: selectedIds() },
            { onSuccess: () => setAll(false) }
        );
    };

    const restrictionProblems = () => getRestrictionProblems(bulkSetMediaRolesMutation.error);

    // the problems that belong to one photo, for marking it in the grid
    const problemsByMedia = () => {
        const byMedia = new Map<Uuid, MediaRestrictionProblem[]>();

        for (const problem of restrictionProblems()) {
            if (problem.mediaId) {
                byMedia.set(problem.mediaId, [...(byMedia.get(problem.mediaId) ?? []), problem]);
            }
        }

        return byMedia;
    };

    const restrictionMessages = () => {
        const error = bulkSetMediaRolesMutation.error ?? bulkClearMediaRolesMutation.error;

        if (!error) {
            return [];
        }

        const problems = restrictionProblems();

        if (problems.length === 0) {
            return [describeError(error)];
        }

        // problems with the request itself are said here; the rest are on their photos
        const general = problems.filter(p => !p.mediaId).map(describeRestrictionProblem);
        const photoCount = problemsByMedia().size;

        return photoCount === 0
            ? general
            : [
                  ...general,
                  `Nothing was changed. ${photoCount} ${photoCount === 1 ? "photo" : "photos"} could not be restricted - ${photoCount === 1 ? "it is" : "they are"} outlined in red, and pointing at one says why.`
              ];
    };

    const describeProblems = (id: Uuid) =>
        problemsByMedia().get(id)?.map(describeRestrictionProblem).join(" ");

    const setAll = (doSelect: boolean) => {
        setMedia(media =>
            media.map(m => {
                if (m.isSelected === doSelect) {
                    return m;
                }

                return { ...m, isSelected: doSelect };
            })
        );
    };

    // only what is on screen - with the gps filter on, the hidden photos already
    // have a location, and selecting them would overwrite it on the next save
    const selectAllShown = () => {
        const shown = new Set(mediaToShow().map(m => m.id));

        setMedia(media =>
            media.map(m => (shown.has(m.id) && !m.isSelected ? { ...m, isSelected: true } : m))
        );
    };

    const onFilterChange = (next: BulkEditFilter) => {
        setAll(false);
        setFilter(next);
    };

    const toggle = (media: SelectableMedia) => {
        setMedia(prev =>
            prev.map(m => {
                if (m.id === media.id) {
                    return { ...m, isSelected: !m.isSelected };
                }

                return m;
            })
        );
    };

    /*
       Rebuilt as the media or the restrictions arrive, keeping whatever was
       selected that is still here - the two land separately, and the second
       should not throw away a selection made after the first.
    */
    createEffect(() => {
        const hidden = (restrictions.data ?? []).filter(r => !r.isVisibleToYou);
        const list = props.mediaService.getMediaList();

        setMedia(prev => {
            const selected = new Set(prev.filter(m => m.isSelected).map(m => m.id));

            return [
                ...list.map(m => buildSelectableMedia(m, selected.has(m.id))),
                ...hidden.map(r => buildHiddenMedia(r, selected.has(r.mediaId)))
            ];
        });
    });

    /*
       A photo hidden from you only appears under the restricted filter. It is
       there to have its restriction changed; the gps filters know nothing of
       it, and a select-all for a gps edit should not reach it.
    */
    const mediaToShow = () => {
        const current = filter();

        if (current === "restricted") {
            const restricted = restrictionById();

            return media().filter(m => restricted.has(m.id));
        }

        const visible = media().filter(m => !m.isHiddenFromYou);

        if (current === "all") {
            return visible;
        }

        const withGps = props.mediaService.mediaWithGps();

        if (current === "withoutGps") {
            const ids = new Set(withGps.map(x => x.media.id));

            return visible.filter(m => !ids.has(m.id));
        }

        const ids = new Set(withGps.filter(x => x.gps.override).map(x => x.media.id));

        return visible.filter(m => ids.has(m.id));
    };

    const describeRestriction = (id: Uuid) => {
        const restriction = restrictionById().get(id);

        if (!restriction) {
            return undefined;
        }

        return restriction.isVisibleToYou
            ? `Restricted to ${restriction.roles.join(", ")}`
            : `Restricted to ${restriction.roles.join(", ")} - hidden from you`;
    };

    return (
        <AdminGuard redirectRoute={props.mediaService.getEntryPathByView(MediaViewGrid)}>
            <Show when={props.mediaService.isReady() && docked()}>
                <Layout
                    toolbar={
                        <Toolbar
                            mediaService={props.mediaService}
                            activeCategory={props.mediaService.getActiveCategory()}
                            activeMedia={props.mediaService.getActiveMedia()}
                        />
                    }
                    sidebar={
                        <BulkEditSidebar
                            onSave={onSave}
                            onSelectAll={selectAllShown}
                            onDeselectAll={() => setAll(false)}
                            onClearOverride={() => setIsConfirmingClear(true)}
                            selectedCount={selectedIds().length}
                            filter={filter()}
                            onFilterChange={onFilterChange}
                            hiddenCount={hiddenCount()}
                            roles={roles.data}
                            onRestrict={onRestrict}
                            onClearRestriction={() => setIsConfirmingUnrestrict(true)}
                            isRestrictionPending={
                                bulkSetMediaRolesMutation.isPending ||
                                bulkClearMediaRolesMutation.isPending
                            }
                            restrictionMessages={[
                                ...(restrictions.isError
                                    ? [
                                          `Could not tell which photos are restricted. ${describeError(restrictions.error)}`
                                      ]
                                    : []),
                                ...restrictionMessages()
                            ]}
                        />
                    }
                >
                    <CategoryBreadcrumb category={props.mediaService.getActiveCategory()} />

                    <div class="listing-flow mb-4">
                        <For each={mediaToShow()}>
                            {m => (
                                <div
                                    class="border-1 cursor-pointer text-center rounded-sm"
                                    classList={{
                                        "border-primary/40 hover:border-primary":
                                            !problemsByMedia().has(m.id),
                                        "border-error outline-2 outline-error":
                                            problemsByMedia().has(m.id)
                                    }}
                                    title={describeProblems(m.id) ?? describeRestriction(m.id)}
                                    onClick={() => toggle(m)}
                                >
                                    <div class="flex items-center justify-center gap-1">
                                        <input
                                            type="checkbox"
                                            class="checkbox checkbox-sm my-1"
                                            checked={m.isSelected}
                                            onInput={evt =>
                                                (m.isSelected = evt.currentTarget.checked)
                                            }
                                        />
                                        <Show when={describeRestriction(m.id)}>
                                            {description => (
                                                <>
                                                    <Icon classes="icon-[ic--round-lock] text-warning" />
                                                    <span class="sr-only">{description()}</span>
                                                </>
                                            )}
                                        </Show>
                                    </div>
                                    <Show
                                        when={m.imageUrl}
                                        fallback={
                                            <div
                                                class="flex flex-col items-center justify-center gap-1 rounded-b-sm bg-base-200 text-base-content/60 text-xs px-1"
                                                style={{
                                                    width: `${getThumbnailSize(ThumbnailSizeDefault).width}px`,
                                                    height: `${getThumbnailSize(ThumbnailSizeDefault).height}px`
                                                }}
                                            >
                                                <Icon classes="icon-[ic--round-visibility-off] text-2xl" />
                                                <span class="truncate max-w-full">{m.slug}</span>
                                                <span>Hidden from you</span>
                                            </div>
                                        }
                                    >
                                        <img
                                            src={m.imageUrl}
                                            /* the checkbox beside it carries the meaning */
                                            alt=""
                                            class="rounded-b-sm"
                                            width={getThumbnailSize(ThumbnailSizeDefault).width}
                                            height={getThumbnailSize(ThumbnailSizeDefault).height}
                                        />
                                    </Show>
                                </div>
                            )}
                        </For>
                    </div>

                    <ConfirmDialog
                        open={isConfirmingClear()}
                        title="Clear GPS Override"
                        confirmLabel="Clear"
                        destructive
                        onConfirm={() => void onConfirmClearOverride()}
                        onCancel={() => setIsConfirmingClear(false)}
                    >
                        Remove the GPS override from {selectedIds().length} selected{" "}
                        {selectedIds().length === 1 ? "photo" : "photos"}? Each will go back to the
                        location its file recorded, if it has one.
                    </ConfirmDialog>

                    <ConfirmDialog
                        open={isConfirmingUnrestrict()}
                        title="Unrestrict"
                        confirmLabel="Unrestrict"
                        destructive
                        onConfirm={onConfirmUnrestrict}
                        onCancel={() => setIsConfirmingUnrestrict(false)}
                    >
                        Remove the restriction from {selectedIds().length} selected{" "}
                        {selectedIds().length === 1 ? "photo" : "photos"}? Each will be visible to
                        everyone who can see its category.
                    </ConfirmDialog>

                    <ConfirmDialog
                        open={!!pendingLockoutRoles()}
                        title="Hide from Admins?"
                        confirmLabel="Restrict"
                        destructive
                        onConfirm={() => restrict(pendingLockoutRoles()!)}
                        onCancel={() => setPendingLockoutRoles(undefined)}
                    >
                        Without the {AdminRole} role, you will only see these photos if you hold one
                        of the roles you chose. If you do not, they will drop out of this category
                        for you too - though they stay listed here under Restricted Photos, where
                        the restriction can be changed or removed.
                    </ConfirmDialog>
                </Layout>
            </Show>
        </AdminGuard>
    );
};

export default ViewBulkEdit;
