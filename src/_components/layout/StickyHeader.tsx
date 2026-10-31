import { ParentComponent, mergeProps } from "solid-js";

interface Props {
    // only from `md` up, for a header that can wrap to several lines - a phone
    // has no height to spare for it
    fromMd?: boolean;
    // the same bar, left in the page's flow - see PageHeader
    pinned?: boolean;
}

/*
   Held at the top of the page's scroller while what it heads is on screen, so
   where you are - and usually the way back out - stays in reach however far
   down you have gone.

   It sticks within its parent's box and leaves with it, so a run of these needs
   a box each: without one, every year's heading piled up at the top of the page
   instead of the next pushing the last away.

   Above the tiles and below anything opened over the page: an open photo and
   the Inspector's overlay are both at 30.

   The space under it is here, the same on every page and the same as the gap
   between tiles, so what follows a header brings no top margin of its own.
*/
const StickyHeader: ParentComponent<Props> = props => {
    const merged = mergeProps({ pinned: true }, props);

    return (
        <div
            class="top-0 z-20 mb-2 bg-base-100/90 backdrop-blur-sm py-1 border-b border-base-content/10"
            classList={{
                sticky: merged.pinned && !props.fromMd,
                "md:sticky": merged.pinned && !!props.fromMd
            }}
        >
            {props.children}
        </div>
    );
};

export default StickyHeader;
