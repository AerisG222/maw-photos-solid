import { useNavigate } from "@solidjs/router";
import { Component } from "solid-js";

import { getPathForViewMode } from "./_routes";
import { useSearchPageSettingsContext } from "../_contexts/settings/SearchPageSettingsContext";

const SearchRedirect: Component = () => {
    const [settings] = useSearchPageSettingsContext();
    const navigate = useNavigate();

    navigate(getPathForViewMode(settings.viewMode), { replace: true });

    return <></>;
};

export default SearchRedirect;
