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
import { useCategoriesContext } from "../_contexts/api/CategoriesContext";
import { describeError } from "../_contexts/api/ApiError";
import {
    MediaRestrictionProblem,
    describeCategoryRolesProblem,
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
import IconButton from "../_components/icon/IconButton";
import BulkEditPreview from "./bulk-edit/BulkEditPreview";
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
    // what the preview opens - absent for a photo hidden from you
    media: Media | undefined;
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
    const { categoryRolesQuery, setCategoryRolesMutation } = useCategoriesContext();
    const roles = rolesQuery();
    const activeCategoryId = () => props.mediaService.getActiveCategory()?.id;
    // eslint-disable-next-line solid/reactivity -- an accessor handed to a query factory, which reads it inside its own tracked options
    const restrictions = categoryRestrictionsQuery(activeCategoryId);
    // eslint-disable-next-line solid/reactivity -- as above
    const categoryRoles = categoryRolesQuery(activeCategoryId);
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
    // the category roles waiting on an answer to "take this category from them?"
    const [pendingCategoryRoles, setPendingCategoryRoles] = createSignal<string[]>();
    // the photo open in the preview, by id so a refetch beneath it does not move it
    const [previewId, setPreviewId] = createSignal<Uuid>();

    const buildSelectableMedia = (media: Media, isSelected: boolean): SelectableMedia => ({
        id: media.id,
        imageUrl: getMediaTeaserUrl(media)!,
        slug: media.slug,
        isHiddenFromYou: false,
        media,
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
        media: undefined,
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
        setCategoryRolesMutation.reset();

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
        setCategoryRolesMutation.reset();

        bulkClearMediaRolesMutation.mutate(
            { mediaIds: selectedIds() },
            { onSuccess: () => setAll(false) }
        );
    };

    const restrictionProblems = () => getRestrictionProblems(bulkSetMediaRolesMutation.error);
    const categoryRolesProblems = () => getRestrictionProblems(setCategoryRolesMutation.error);

    /*
       What to say on each photo that stopped the last change, for marking it in
       the grid. Both kinds of refusal can name photos: a selection that could
       not be restricted, and restricted photos that depend on a role being taken
       away from the category. Only the latest attempt's are ever present - each
       card clears the other's refusal when it acts.
    */
    const messagesByMedia = () => {
        const byMedia = new Map<Uuid, string[]>();

        const add = (
            problems: MediaRestrictionProblem[],
            describe: typeof describeRestrictionProblem
        ) => {
            for (const problem of problems) {
                if (problem.mediaId) {
                    byMedia.set(problem.mediaId, [
                        ...(byMedia.get(problem.mediaId) ?? []),
                        describe(problem)
                    ]);
                }
            }
        };

        add(restrictionProblems(), describeRestrictionProblem);
        add(categoryRolesProblems(), describeCategoryRolesProblem);

        return byMedia;
    };

    const countPhotos = (problems: MediaRestrictionProblem[]) =>
        new Set(problems.filter(p => p.mediaId).map(p => p.mediaId)).size;

    /*
       A refusal in words: problems with the request itself said outright, and
       those that belong to a photo summarized here and spelled out on the photo.
    */
    const describeRefusal = (
        error: Error | null,
        problems: MediaRestrictionProblem[],
        describe: typeof describeRestrictionProblem,
        photoSummary: (count: number) => string
    ) => {
        if (!error) {
            return [];
        }

        if (problems.length === 0) {
            return [describeError(error)];
        }

        const general = problems.filter(p => !p.mediaId).map(describe);
        const photoCount = countPhotos(problems);

        return photoCount === 0 ? general : [...general, photoSummary(photoCount)];
    };

    const photos = (count: number) => `${count} ${count === 1 ? "photo" : "photos"}`;
    const outlined = (count: number) =>
        `${count === 1 ? "it is" : "they are"} outlined in red, and pointing at one says why.`;

    const restrictionMessages = () =>
        describeRefusal(
            bulkSetMediaRolesMutation.error ?? bulkClearMediaRolesMutation.error,
            restrictionProblems(),
            describeRestrictionProblem,
            count =>
                `Nothing was changed. ${photos(count)} could not be restricted - ${outlined(count)}`
        );

    const categoryRolesMessages = () =>
        describeRefusal(
            setCategoryRolesMutation.error,
            categoryRolesProblems(),
            describeCategoryRolesProblem,
            count =>
                `Nothing was changed. ${photos(count)} restricted to a role you removed - ${outlined(count)} Change ${count === 1 ? "its" : "their"} restriction first.`
        );

    const describeProblems = (id: Uuid) => messagesByMedia().get(id)?.join(" ");

    const saveCategoryRoles = (roles: string[]) => {
        const categoryId = activeCategoryId();

        setPendingCategoryRoles(undefined);
        bulkSetMediaRolesMutation.reset();
        bulkClearMediaRolesMutation.reset();

        if (categoryId) {
            setCategoryRolesMutation.mutate({ categoryId, roles });
        }
    };

    /*
       Taking a role away takes the whole category from everyone who saw it
       through that role, so that is asked about. Granting one is not.
    */
    const removedRoles = (roles: string[]) =>
        (categoryRoles.data ?? []).filter(role => !roles.includes(role));

    const onSaveCategoryRoles = (roles: string[]) => {
        if (removedRoles(roles).length > 0) {
            setPendingCategoryRoles(roles);
        } else {
            saveCategoryRoles(roles);
        }
    };

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

    const toggle = (id: Uuid) => {
        setMedia(prev =>
            prev.map(m => {
                if (m.id === id) {
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

    /*
       What the preview steps through: the photos on screen, in their order,
       less any hidden from you - there is no image of those to show.
    */
    const previewItems = () =>
        mediaToShow()
            .filter(m => !!m.media)
            .map(m => ({ media: m.media!, isSelected: m.isSelected }));

    // closes itself if the photo leaves the grid - a filter change, or a refetch
    const previewIndex = () => {
        const id = previewId();
        const index = id ? previewItems().findIndex(item => item.media.id === id) : -1;

        return index === -1 ? undefined : index;
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
                            categoryRoles={categoryRoles.data}
                            onSaveCategoryRoles={onSaveCategoryRoles}
                            isCategoryRolesPending={setCategoryRolesMutation.isPending}
                            categoryRolesMessages={[
                                ...(categoryRoles.isError
                                    ? [
                                          `Could not load who this category is shared with. ${describeError(categoryRoles.error)}`
                                      ]
                                    : []),
                                ...categoryRolesMessages()
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
                                            !messagesByMedia().has(m.id),
                                        "border-error outline-2 outline-error":
                                            messagesByMedia().has(m.id)
                                    }}
                                    title={describeProblems(m.id) ?? describeRestriction(m.id)}
                                    onClick={() => toggle(m.id)}
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
                                        when={m.imageUrl && m.media}
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
                                        {/* the button shows on hover, or when tabbed to */}
                                        <div class="relative group">
                                            <img
                                                src={m.imageUrl}
                                                /* the checkbox beside it carries the meaning */
                                                alt=""
                                                class="rounded-b-sm"
                                                width={getThumbnailSize(ThumbnailSizeDefault).width}
                                                height={
                                                    getThumbnailSize(ThumbnailSizeDefault).height
                                                }
                                            />
                                            <IconButton
                                                label="Preview"
                                                buttonClasses="btn-sm absolute bottom-1 right-1 bg-base-100/80 opacity-0 group-hover:opacity-100 focus-visible:opacity-100"
                                                onClick={() => setPreviewId(m.id)}
                                            >
                                                <Icon classes="icon-[ic--round-zoom-in] text-lg" />
                                            </IconButton>
                                        </div>
                                    </Show>
                                </div>
                            )}
                        </For>
                    </div>

                    <BulkEditPreview
                        items={previewItems()}
                        index={previewIndex()}
                        onIndexChange={index => setPreviewId(previewItems()[index]?.media.id)}
                        onToggle={media => toggle(media.id)}
                        onClose={() => setPreviewId(undefined)}
                        describeRestriction={media => describeRestriction(media.id)}
                    />

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
                        open={!!pendingCategoryRoles()}
                        title="Stop Sharing Category"
                        confirmLabel="Save"
                        destructive
                        onConfirm={() => saveCategoryRoles(pendingCategoryRoles()!)}
                        onCancel={() => setPendingCategoryRoles(undefined)}
                    >
                        Anyone who sees this category only as{" "}
                        {removedRoles(pendingCategoryRoles() ?? []).join(" or ")} will lose it,
                        along with every photo in it. Their browser may keep photos they already
                        viewed for up to a week, and an app that already synced the category may
                        keep listing it until it syncs from scratch.
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
