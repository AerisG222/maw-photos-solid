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
*/
const ItemActions: Component<Props> = props => {
    const { downloadFile } = useCategoriesContext();

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

    const share = () => {
        navigator.share({ url: getMediaShareUrl(props.activeMedia!) }).catch(() => {
            // a share the reader dismissed is not an error worth reporting
        });
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

                    {/*
                        Offered wherever the photograph is, not only while
                        browsing the category itself. A photograph belongs to one
                        whether you reached it from that category, from a person
                        or from a place.
                    */}
                    <Show when={props.activeCategory}>
                        <DropdownMenu.Separator class="my-1 border-t border-base-content/20" />

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

                    <Show when={navigator.canShare?.() && props.activeMedia}>
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
