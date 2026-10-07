import { Component, Show } from "solid-js";
import { Dialog as KobalteDialog } from "@kobalte/core/dialog";

import { Media } from "../../_models/Media";
import { getMainMediaUrl } from "../../_models/utils/MediaUtils";
import { useConfigContext } from "../../_contexts/api/ConfigContext";

import Icon from "../../_components/icon/Icon";

export interface PreviewItem {
    media: Media;
    isSelected: boolean;
}

interface Props {
    // the photos on screen, in grid order - the ones the arrows step through
    items: PreviewItem[];
    // which of them is open, or undefined when the preview is closed
    index: number | undefined;
    onIndexChange: (index: number) => void;
    onToggle: (media: Media) => void;
    onClose: () => void;
    // a sentence about who may see it, for the restricted ones
    describeRestriction: (media: Media) => string | undefined;
}

/*
   A closer look at a photograph while choosing which to edit.

   A thumbnail is enough to recognize a scene, rarely enough to tell two frames
   of it apart - and bulk edit is exactly where that matters, since what is
   chosen here is changed together. So the preview steps through what the grid
   is showing, and selects from where it stands: arrows to move, space to
   choose, escape to go back to the grid with the choices made.

   The rendition is the one the detail view would show at this window size, not
   the original - the same file the reader would be looking at anywhere else.
*/
const BulkEditPreview: Component<Props> = props => {
    const { getScalesForMain } = useConfigContext();

    const current = () => (props.index === undefined ? undefined : props.items[props.index]);

    const hasPrevious = () => (props.index ?? 0) > 0;
    const hasNext = () => props.index !== undefined && props.index < props.items.length - 1;

    const previous = () => {
        if (hasPrevious()) {
            props.onIndexChange(props.index! - 1);
        }
    };

    const next = () => {
        if (hasNext()) {
            props.onIndexChange(props.index! + 1);
        }
    };

    const toggle = () => {
        const item = current();

        if (item) {
            props.onToggle(item.media);
        }
    };

    /*
       Kept inside the dialog: the page's own shortcuts listen further up, and a
       key meant for the preview should not also move or change the page
       beneath it.
    */
    const onKeyDown = (evt: KeyboardEvent) => {
        const handlers: Record<string, () => void> = {
            ArrowLeft: previous,
            ArrowRight: next,
            " ": toggle
        };

        const handler = handlers[evt.key];

        if (handler && !(evt.key === " " && ownsSpace(evt.target))) {
            evt.preventDefault();
            evt.stopPropagation();
            handler();
        }
    };

    /*
       Space always means "select this one", wherever focus has landed. Only the
       checkbox, which toggles itself, and a video, where it plays, keep it.

       A button would otherwise press on space - the close button, which the
       dialog focuses on open unless told otherwise, or Next, which keeps focus
       after a click - so selecting would close the preview or move on instead.
       Enter still presses them. A button acts on space as the key comes up, so
       that is suppressed as well as the key going down.
    */
    const ownsSpace = (target: EventTarget | null) =>
        target instanceof HTMLInputElement || target instanceof HTMLVideoElement;

    const onKeyUp = (evt: KeyboardEvent) => {
        if (evt.key === " " && evt.target instanceof HTMLButtonElement) {
            evt.preventDefault();
        }
    };

    let content: HTMLDivElement | undefined;

    // the dialog itself rather than its first button, so nothing is pressed by
    // a key meant for the photograph
    const focusContent = (evt: Event) => {
        evt.preventDefault();
        content?.focus();
    };

    return (
        <KobalteDialog
            open={!!current()}
            onOpenChange={open => {
                if (!open) {
                    props.onClose();
                }
            }}
        >
            <KobalteDialog.Portal>
                <KobalteDialog.Overlay class="fixed inset-0 z-50 bg-black/80" />

                <div class="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <KobalteDialog.Content
                        ref={content}
                        tabIndex={-1}
                        class="bg-base-100 rounded-box p-4 elev-overlay flex flex-col max-h-full max-w-full outline-none"
                        onKeyDown={onKeyDown}
                        onKeyUp={onKeyUp}
                        onOpenAutoFocus={focusContent}
                    >
                        <Show when={current()}>
                            {item => (
                                <>
                                    <div class="flex items-baseline gap-4">
                                        <KobalteDialog.Title class="head3 m-0 truncate">
                                            {item().media.slug}
                                        </KobalteDialog.Title>
                                        <span class="text-sm text-muted shrink-0">
                                            {props.index! + 1} of {props.items.length}
                                        </span>
                                        <Show when={props.describeRestriction(item().media)}>
                                            {restriction => (
                                                <span class="text-sm text-warning shrink-0">
                                                    <Icon classes="icon-[ic--round-lock] mr-1" />
                                                    {restriction()}
                                                </span>
                                            )}
                                        </Show>
                                        <KobalteDialog.CloseButton
                                            class="btn btn-sm btn-circle btn-ghost ml-auto shrink-0"
                                            aria-label="Close preview"
                                        >
                                            <Icon classes="icon-[ic--round-close] text-lg" />
                                        </KobalteDialog.CloseButton>
                                    </div>

                                    <div class="my-3 min-h-0 flex items-center justify-center">
                                        <Show
                                            when={item().media.type === "video"}
                                            fallback={
                                                <img
                                                    src={getMainMediaUrl(
                                                        item().media,
                                                        getScalesForMain()
                                                    )}
                                                    alt=""
                                                    class="max-h-[75dvh] max-w-full object-contain rounded-sm"
                                                />
                                            }
                                        >
                                            <video
                                                src={getMainMediaUrl(
                                                    item().media,
                                                    getScalesForMain()
                                                )}
                                                controls
                                                class="max-h-[75dvh] max-w-full rounded-sm"
                                            />
                                        </Show>
                                    </div>

                                    <div class="flex items-center justify-between gap-4">
                                        <button
                                            class="btn btn-sm"
                                            disabled={!hasPrevious()}
                                            onClick={previous}
                                        >
                                            <Icon classes="icon-[ic--round-chevron-left] text-lg" />
                                            Previous
                                        </button>

                                        <label class="label cursor-pointer gap-2">
                                            <input
                                                type="checkbox"
                                                class="checkbox checkbox-sm"
                                                checked={item().isSelected}
                                                onChange={toggle}
                                            />
                                            <span class="label-text">Selected</span>
                                            <kbd class="kbd kbd-sm">Space</kbd>
                                        </label>

                                        <button
                                            class="btn btn-sm"
                                            disabled={!hasNext()}
                                            onClick={next}
                                        >
                                            Next
                                            <Icon classes="icon-[ic--round-chevron-right] text-lg" />
                                        </button>
                                    </div>
                                </>
                            )}
                        </Show>
                    </KobalteDialog.Content>
                </div>
            </KobalteDialog.Portal>
        </KobalteDialog>
    );
};

export default BulkEditPreview;
