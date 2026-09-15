import { Component, Show, createMemo } from "solid-js";
import { DropdownMenu } from "@kobalte/core/dropdown-menu";

import { buildCategoryDownloadUrl } from "../../_contexts/api/_shared";
import { Category } from "../../_models/Category";
import { Media } from "../../_models/Media";
import { getFilenameFromUrl, getMediaShareUrl } from "../../_models/utils/MediaUtils";
import { useCategoriesContext } from "../../_contexts/api/CategoriesContext";

import Icon from "../icon/Icon";

interface Props {
    activeMedia: Media | undefined;
    activeCategory: Category | undefined;
    // whether a whole-category download belongs here at all - see IMediaService
    canDownloadCategory: boolean;
}

/*
   The things you can do to one photograph, rather than to the listing it sits
   in.

   Downloading and sharing used to live in the detail view's toolbar and nowhere
   else, which meant finding a photograph in the grid and wanting the full
   resolution of it was a trip through another view. They follow the photograph
   now, like everything else the inspector holds.

   A menu rather than four more toolbar buttons: these are used rarely and read
   as a list - "high res", "low res", "the whole category" - where a row of icons
   would be four more things to decode on a toolbar that already has enough.

   Two scopes, not one. The resolutions and the share act on the photograph and
   need one selected. The category zip acts on what is being *listed*, so it
   belongs here whenever a category is what you are browsing - including with
   nothing selected at all, which is how most of a visit to a category is spent.
*/
const ItemActions: Component<Props> = props => {
    const { downloadFile, fetchFile } = useCategoriesContext();

    const fileUrl = (scale: string) =>
        props.activeMedia?.files.find(f => f.scale === scale && f.type !== "video-poster")?.path ??
        "";

    const lowResUrl = createMemo(() => fileUrl("full-hd"));
    const highResUrl = createMemo(() => fileUrl("full"));

    const download = (url: string, name: string) => {
        if (url) {
            downloadFile(url, name).catch((error: unknown) => {
                console.error("Download failed:", error);
            });
        }
    };

    /*
       What a share should carry.

       The photograph itself, where the platform will take one. A link into the
       application is only useful to somebody who has an account here - which is
       nobody a photograph is usually being sent to - so a file is the thing
       worth sharing and the link is the fallback for platforms that will only
       take one.

       `full-hd` rather than the original: a share sheet is on its way to a
       message or a chat, and the original can be tens of megabytes. The
       high-resolution download above is still there for when the original is
       what you want.
    */
    const shareFileUrl = createMemo(() => fileUrl("full-hd") || fileUrl("full"));

    const shareUrl = () => (props.activeMedia ? getMediaShareUrl(props.activeMedia) : undefined);

    /*
       Whether files can be shared at all, asked with an empty one.

       There is no way to ask without a `File` in hand, and fetching a
       photograph to find out the answer is no would be a waste every time the
       menu opened. An empty file of the right type answers the only question
       being asked, which is whether the platform takes files.
    */
    const canShareFiles = () =>
        !!navigator.canShare?.({ files: [new File([], "photo.jpg", { type: "image/jpeg" })] });

    const canShareLink = () => {
        const url = shareUrl();

        return !!url && !!navigator.canShare?.({ url });
    };

    const shareFile = async (url: string) => {
        const blob = await fetchFile(url);
        const file = new File([blob], getFilenameFromUrl(url, "share"), { type: blob.type });

        await navigator.share({ files: [file] });
    };

    const share = () => {
        const url = shareUrl();

        if (canShareFiles() && shareFileUrl()) {
            /*
               Only one sheet, whatever happens. A reader who dismissed the
               share did not ask to be offered a second one, and the fetch
               failing is worth a line in the console rather than a silent
               downgrade to a link they cannot use.
            */
            shareFile(shareFileUrl()).catch((error: unknown) => {
                if ((error as Error | undefined)?.name !== "AbortError") {
                    console.error("Share failed:", error);
                }
            });

            return;
        }

        if (url) {
            navigator.share({ url }).catch(() => {
                // a share the reader dismissed is not an error worth reporting
            });
        }
    };

    const itemClass =
        "flex items-center gap-2 px-3 py-2 text-body cursor-pointer rounded-field " +
        "ui-highlighted:bg-secondary ui-highlighted:text-secondary-content outline-none";

    return (
        <DropdownMenu>
            <DropdownMenu.Trigger
                class="flex px-3 py-2 hover:bg-secondary hover:text-secondary-content hover:cursor-pointer transition-colors duration-150 ease-out"
                title="More Actions"
                aria-label="More actions for this item"
            >
                <Icon classes="icon-[ic--round-more-vert]" />
            </DropdownMenu.Trigger>

            <DropdownMenu.Portal>
                <DropdownMenu.Content class="z-50 min-w-56 bg-base-100 rounded-box p-1 elev-overlay">
                    <Show when={props.activeMedia}>
                        <DropdownMenu.Item
                            class={itemClass}
                            disabled={!highResUrl()}
                            onSelect={() =>
                                download(highResUrl(), getFilenameFromUrl(highResUrl(), "high"))
                            }
                        >
                            <Icon classes="icon-[ic--round-image]" />
                            High Resolution
                        </DropdownMenu.Item>

                        <DropdownMenu.Item
                            class={itemClass}
                            disabled={!lowResUrl()}
                            onSelect={() =>
                                download(lowResUrl(), getFilenameFromUrl(lowResUrl(), "low"))
                            }
                        >
                            <Icon classes="icon-[ic--round-image]" />
                            Low Resolution
                        </DropdownMenu.Item>
                    </Show>

                    <Show when={props.canDownloadCategory && props.activeCategory}>
                        <Show when={props.activeMedia}>
                            <DropdownMenu.Separator class="my-1 border-t border-base-content/20" />
                        </Show>

                        <DropdownMenu.Item
                            class={itemClass}
                            onSelect={() =>
                                download(
                                    buildCategoryDownloadUrl(props.activeCategory!.id),
                                    `${props.activeCategory!.year}-${props.activeCategory!.slug}.zip`
                                )
                            }
                        >
                            <Icon classes="icon-[ic--round-file-download]" />
                            Download {props.activeCategory!.name} (.zip)
                        </DropdownMenu.Item>
                    </Show>

                    <Show when={props.activeMedia && (canShareFiles() || canShareLink())}>
                        <DropdownMenu.Separator class="my-1 border-t border-base-content/20" />

                        <DropdownMenu.Item class={itemClass} onSelect={share}>
                            <Icon classes="icon-[ic--round-share]" />
                            Share
                        </DropdownMenu.Item>
                    </Show>
                </DropdownMenu.Content>
            </DropdownMenu.Portal>
        </DropdownMenu>
    );
};

export default ItemActions;
