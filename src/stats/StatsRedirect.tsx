import { useNavigate } from "@solidjs/router";
import { Component } from "solid-js";

import { statsCombined } from "./_routes";

const StatsRedirect: Component = () => {
    const navigate = useNavigate();

    navigate(statsCombined.absolutePath, { replace: true });

    return <></>;
};

export default StatsRedirect;
