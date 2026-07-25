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
            fallback={(error: unknown, reset: () => void) => (
                <ErrorMessage title={props.title} error={error} onRetry={reset} />
            )}
        >
            {props.children}
        </ErrorBoundary>
    );
};

export default AppErrorBoundary;
