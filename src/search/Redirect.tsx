import { useNavigate } from "../_router/compat";
import { useAreaSettingsContext } from "../_contexts/settings/AreaSettingsContext";
import { Component } from "solid-js";

import { getPathForViewMode } from "./_routes";

const SearchRedirect: Component = () => {
    const [area] = useAreaSettingsContext();
    const navigate = useNavigate();

    navigate(getPathForViewMode(area.searchView), { replace: true });

    return <></>;
};

export default SearchRedirect;
