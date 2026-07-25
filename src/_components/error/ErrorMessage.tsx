import { Component, Show } from "solid-js";

import { describeError } from "../../_contexts/api/ApiError";

interface Props {
    // what the user was trying to do, e.g. "Could not load categories"
    title?: string;
    error?: unknown;
    // omit to render without a retry affordance
    onRetry?: () => void;
    retryLabel?: string;
}

/*
   The single way this app tells someone something failed. Always offers a way
   forward rather than leaving a dead end, and never prints a raw internal
   message - `describeError` maps the cause to a human sentence.
*/
const ErrorMessage: Component<Props> = props => {
    return (
        <div class="flex flex-col items-center text-center gap-3 my-8 mx-4" role="alert">
            <span class="text-6 text-error icon-[ic--round-error-outline]" />

            <div>
                <p class="font-bold text-error">{props.title ?? "Something went wrong"}</p>
                <p class="text-sm mt-1">{describeError(props.error)}</p>
            </div>

            <Show when={props.onRetry}>
                <button
                    class="btn btn-sm btn-primary btn-outline"
                    onClick={() => props.onRetry?.()}
                >
                    <span class="icon-[ic--round-refresh]" />
                    {props.retryLabel ?? "Try Again"}
                </button>
            </Show>
        </div>
    );
};

export default ErrorMessage;
