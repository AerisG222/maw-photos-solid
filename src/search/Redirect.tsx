import { Component } from "solid-js";
import { Navigate } from "@tanstack/solid-router";

import { useAreaSettingsContext } from "../_contexts/settings/AreaSettingsContext";
import { equalsIgnoreCase } from "../_models/utils/StringUtils";

// the view last used, which is a setting rather than anything the address says
const SearchRedirect: Component = () => {
    const [area] = useAreaSettingsContext();

    return (
        <Navigate
            to={equalsIgnoreCase("list", area.searchView) ? "/search/list" : "/search/grid"}
            replace
        />
    );
};

export default SearchRedirect;
