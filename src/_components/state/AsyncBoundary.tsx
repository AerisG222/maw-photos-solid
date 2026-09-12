import { JSXElement, Match, Show, Switch, children } from "solid-js";

import { RetryableQuery, findQueryError, refetchQueries } from "../error/_queryError";

import ErrorMessage from "../error/ErrorMessage";

interface Props {
    /*
       The queries this screen is waiting on. The reader does not care which of
       several failed, so the first real failure is what gets reported and a
       retry re-runs all of them.
    */
    queries?: (RetryableQuery | undefined)[];
    /*
       For a screen whose hook has already worked out the failure across several
       queries of its own - the category listings do this. Give these or
       `queries`, not both.
    */
    error?: unknown;
    onRetry?: () => void;
    // what the reader was trying to do, e.g. "Could not load categories"
    errorTitle: string;
    // the data, once it has arrived. Falsy means it is still on its way
    when: unknown;
    skeleton?: JSXElement;
    // true once the data is here and there is simply none of it
    isEmpty?: boolean;
    empty?: JSXElement;
    children: JSXElement;
}

/*
   Loading, failed, empty, loaded - in one place, so every screen answers them
   the same way. Roughly fifteen screens hand-rolled this triad before, and two
   of them forgot the loading branch entirely.

   The error is checked first, deliberately: a failed query leaves its data
   undefined, which is indistinguishable from still-loading, so testing for the
   data first would leave a broken screen showing a skeleton forever.
*/
const AsyncBoundary = (props: Props) => {
    const failure = () => props.error ?? findQueryError(props.queries ?? []);
    const retry = () => (props.onRetry ? props.onRetry() : refetchQueries(props.queries ?? []));

    const c = children(() => props.children);
    const skeleton = children(() => props.skeleton);
    const empty = children(() => props.empty);

    return (
        <Switch fallback={skeleton()}>
            <Match when={failure()}>
                <ErrorMessage title={props.errorTitle} error={failure()} onRetry={retry} />
            </Match>

            <Match when={props.when}>
                <Show when={!props.isEmpty} fallback={empty()}>
                    {c()}
                </Show>
            </Match>
        </Switch>
    );
};

export default AsyncBoundary;
