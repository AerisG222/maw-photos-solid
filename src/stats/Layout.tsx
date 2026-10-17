import { Component } from "solid-js";
import { Outlet } from "@tanstack/solid-router";

import { StatsProvider } from "../_contexts/api/StatsContext";

// signing in is checked on the route itself - see _routeTree.tsx
const Stats: Component = () => {
    return (
        <StatsProvider>
            <Outlet />
        </StatsProvider>
    );
};

export default Stats;
