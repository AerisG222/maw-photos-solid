import { useNavigate } from "@solidjs/router";
import { Component } from "solid-js";

import { statsPhotos } from "./_routes";

const StatsRedirect: Component = () => {
    const navigate = useNavigate();

    navigate(statsPhotos.absolutePath);

    return <></>;
};

export default StatsRedirect;
