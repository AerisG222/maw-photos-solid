import { ParentComponent, children, createEffect } from "solid-js";

import { useAppSettingsContext } from "../../_contexts/settings/AppSettingsContext";

const ThemeWrapper: ParentComponent = props => {
    const [, { resolvedTheme }] = useAppSettingsContext();
    const c = children(() => props.children);

    // keep <html> matching the wrapper so the document background (and anything
    // outside the app shell, e.g. overscroll) stays on-theme after a toggle
    createEffect(() => {
        document.documentElement.setAttribute("data-theme", resolvedTheme());
        document.documentElement.style.colorScheme = resolvedTheme();
    });

    return <div data-theme={resolvedTheme()}>{c()}</div>;
};

export default ThemeWrapper;
