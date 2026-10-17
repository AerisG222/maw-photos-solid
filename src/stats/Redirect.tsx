import { useNavigate } from "../_router/compat";
import { Component } from "solid-js";

import { statsSummary } from "./_routes";

const StatsRedirect: Component = () => {
    const navigate = useNavigate();

    navigate(statsSummary.absolutePath, { replace: true });

    return <></>;
};

export default StatsRedirect;
