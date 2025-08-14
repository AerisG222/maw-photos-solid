import { ParentComponent, children } from "solid-js";

import { useAppSettingsContext } from "../../contexts/settings/AppSettingsContext";

const ThemeWrapper: ParentComponent = props => {
    const [appSettings] = useAppSettingsContext();
    const c = children(() => props.children);

    return <div data-theme={appSettings.theme}>{c()}</div>;
};

export default ThemeWrapper;
