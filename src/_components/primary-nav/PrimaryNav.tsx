import { Component } from "solid-js";

import { categories } from "../../categories/_routes";
import { search } from "../../search/_routes";
import { randomMediaRoutes } from "../../random/_routes";
import { stats } from "../../stats/_routes";
import { about } from "../../about/_routes";
import { settings } from "../../settings/_routes";
import { useAppSettingsContext } from "../../_contexts/settings/AppSettingsContext";

import PrimaryNavLink from "./PrimaryNavLink";
import ThemeSelector from "./ThemeSelector";
import PrimaryNavCollapseButton from "./PrimaryNavCollapseButton";

const PrimaryNav: Component = () => {
    const [state] = useAppSettingsContext();

    return (
        <div class="flex md:flex-col bg-base-300 border-b-1 md:border-r-1 border-base-content/30">
            <PrimaryNavLink showTitle={!state.isPrimaryNavCollapsed} route={categories} />
            <PrimaryNavLink showTitle={!state.isPrimaryNavCollapsed} route={search} />
            <PrimaryNavLink showTitle={!state.isPrimaryNavCollapsed} route={randomMediaRoutes} />
            <PrimaryNavLink showTitle={!state.isPrimaryNavCollapsed} route={stats} />

            <span class="flex-grow" />

            <ThemeSelector showTitle={!state.isPrimaryNavCollapsed} />
            <PrimaryNavLink showTitle={!state.isPrimaryNavCollapsed} route={about} />
            <PrimaryNavLink showTitle={!state.isPrimaryNavCollapsed} route={settings} />

            <div class="divider my-0 h-auto" />

            <PrimaryNavCollapseButton />
        </div>
    );
};

export default PrimaryNav;
