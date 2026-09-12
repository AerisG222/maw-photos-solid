import { ErrorBoundary, ParentComponent } from "solid-js";

import ErrorMessage from "./ErrorMessage";

interface Props {
    title?: string;
}

/*
   Catches anything thrown while rendering its subtree and shows a recoverable
   message instead of tearing down to a blank page.

   Note this does NOT resolve children through the `children()` helper the way
   most wrappers in this codebase do. That helper evaluates them eagerly in the
   parent scope, which would run the child components *outside* the boundary and
   let their errors escape it. Passing `props.children` straight through keeps
   the evaluation inside, where it can be caught.
*/
const AppErrorBoundary: ParentComponent<Props> = props => {
    return (
        <ErrorBoundary
            // solid types the caught value as `any`; narrow it to `unknown` so
            // it can only be handled through describeError
            fallback={(error: unknown, reset: () => void) => {
                /*
                   The reader gets a sentence. Whoever has to fix it needs the
                   original, and `describeError` deliberately throws away
                   everything specific - so without this the boundary swallows
                   the one artifact that says what actually happened, and a
                   report of "I get the generic error" has nothing behind it.
                */
                console.error(props.title ?? "Unhandled error", error);

                return <ErrorMessage title={props.title} error={error} onRetry={reset} />;
            }}
        >
            {props.children}
        </ErrorBoundary>
    );
};

export default AppErrorBoundary;
