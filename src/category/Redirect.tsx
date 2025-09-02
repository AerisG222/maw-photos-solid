import { Component } from "solid-js";
import { useNavigate, useParams } from "@solidjs/router";

import { useMediaPageSettingsContext } from "../_contexts/settings/MediaPageSettingsContext";
import { MediaView } from "../media/models/MediaView";
import { getMediaPathByView } from "../media/models/RouteHelpers";

const Redirect: Component = () => {
    const navigate = useNavigate();
    const [settings] = useMediaPageSettingsContext();
    const params = useParams();

    navigate(getMediaPathByView(settings.viewMode as MediaView, params.categoryId as Uuid), {
        replace: true
    });

    return <></>;
};

export default Redirect;
