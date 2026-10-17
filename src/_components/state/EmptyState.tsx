import { Component, Show } from "solid-js";
import { Link, LinkOptions } from "@tanstack/solid-router";

interface Props {
    // an ic--round icon describing what is missing
    icon?: string;
    // the fact, in a few words: "No people match that name"
    title: string;
    // optional second line - what the reader might do about it
    detail?: string;
    actionLabel?: string;
    // a way forward: either something to do, or somewhere to go
    onAction?: () => void;
    // where the action leads - built with `linkOptions`, so it is checked
    actionLink?: LinkOptions;
}

/*
   Nothing to show, said the same way everywhere.

   This replaces nine variants of `<p class="text-center my-8">...</p>` scattered
   through the areas, which differed in wording, spacing and whether they
   offered any way forward at all. An empty listing is a normal state, not a
   failure, so it is quieter than ErrorMessage - but it still says what would
   fill it.
*/
const EmptyState: Component<Props> = props => {
    return (
        <div class="flex flex-col items-center text-center gap-3 my-12 mx-4">
            <Show when={props.icon}>
                <span class={`icon-md text-base-content/40 ${props.icon}`} aria-hidden="true" />
            </Show>

            <div>
                <p class="font-bold">{props.title}</p>
                <Show when={props.detail}>
                    <p class="text-sm mt-1 text-base-content/70">{props.detail}</p>
                </Show>
            </div>

            <Show when={props.actionLabel && props.onAction}>
                <button
                    class="btn btn-sm btn-primary btn-outline"
                    onClick={() => props.onAction?.()}
                >
                    {props.actionLabel}
                </button>
            </Show>

            <Show when={props.actionLabel && props.actionLink}>
                <Link {...props.actionLink!} class="btn btn-sm btn-primary btn-outline">
                    {props.actionLabel}
                </Link>
            </Show>
        </div>
    );
};

export default EmptyState;
