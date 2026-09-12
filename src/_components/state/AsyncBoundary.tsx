import { JSXElement, Match, Show, Switch } from "solid-js";

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

   None of the three slots is resolved through the `children()` helper, for the
   same reason AppErrorBoundary avoids it: that helper evaluates them here, in
   this component's own scope, rather than where they are rendered. A screen
   whose children reach into data that has not arrived - `Object.keys(data()!)`,
   say - then throws while the skeleton is supposed to be showing. Read the slots
   only inside the branch that renders them.
*/
const AsyncBoundary = (props: Props) => {
    const failure = () => props.error ?? findQueryError(props.queries ?? []);
    const retry = () => (props.onRetry ? props.onRetry() : refetchQueries(props.queries ?? []));

    return (
        <Switch fallback={props.skeleton}>
            <Match when={failure()}>
                <ErrorMessage title={props.errorTitle} error={failure()} onRetry={retry} />
            </Match>

            <Match when={props.when}>
                <Show when={!props.isEmpty} fallback={props.empty}>
                    {props.children}
                </Show>
            </Match>
        </Switch>
    );
};

export default AsyncBoundary;
