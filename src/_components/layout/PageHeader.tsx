import { JSXElement, ParentComponent, Show, children, mergeProps } from "solid-js";

import StickyHeader from "./StickyHeader";

interface Props {
    // what this page is - a name, or a trail of links ending on one
    title: JSXElement;
    // the page's own controls, on the same row at the far end: its filter, its search
    actions?: JSXElement;
    // for a page with headings of its own that stick where this would - see YearHeading
    pinned?: boolean;
}

/*
   The top of a page, the same way on every page: one row, its name on the left
   and whatever narrows what is below it on the right. Anything that has to stay
   with the row - the count while picking people - goes underneath it as children.

   The sections each answered this for themselves. Some had a large title and some
   a small one, some gold and some purple, some left and some centered, and some
   gave their filters a row of their own or had no title at all.
*/
const PageHeader: ParentComponent<Props> = props => {
    const merged = mergeProps({ pinned: true }, props);
    const actions = children(() => props.actions);

    return (
        <StickyHeader pinned={merged.pinned}>
            {/* as tall as its controls with or without them, so every page's content starts level */}
            <div class="flex min-h-8 flex-wrap items-center justify-between gap-x-6 gap-y-1">
                <h1 class="head1 m-0">{props.title}</h1>

                <Show when={actions()}>
                    <div class="flex max-w-full flex-wrap items-center gap-x-6 gap-y-1">
                        {actions()}
                    </div>
                </Show>
            </div>

            {props.children}
        </StickyHeader>
    );
};

export default PageHeader;
