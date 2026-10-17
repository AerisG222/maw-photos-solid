import { Component } from "solid-js";
import { Outlet } from "@tanstack/solid-router";

import { VisualEffectsProvider } from "./contexts/VisualEffectsContext";

// the frame every media area shares; signing in is checked on each area's route
const MediaRoot: Component = () => {
    return (
        <VisualEffectsProvider>
            <Outlet />
        </VisualEffectsProvider>
    );
};

export default MediaRoot;
