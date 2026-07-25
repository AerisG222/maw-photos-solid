import { ParentComponent, children, createEffect } from "solid-js";

import { useAppSettingsContext } from "../../_contexts/settings/AppSettingsContext";

const ThemeWrapper: ParentComponent = props => {
    const [appSettings] = useAppSettingsContext();
    const c = children(() => props.children);

    // keep <html> matching the wrapper so the document background (and anything
    // outside the app shell, e.g. overscroll) stays on-theme after a toggle
    createEffect(() => {
        document.documentElement.setAttribute("data-theme", appSettings.theme);
        document.documentElement.style.colorScheme = appSettings.theme;
    });

    return <div data-theme={appSettings.theme}>{c()}</div>;
};

export default ThemeWrapper;
