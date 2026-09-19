import { Component, Show } from "solid-js";

import { categories } from "../../categories/_routes";
import { people } from "../../people/_routes";
import { places } from "../../places/_routes";
import { search } from "../../search/_routes";
import { randomMediaRoutes } from "../../random/_routes";
import { stats } from "../../stats/_routes";
import { about } from "../../about/_routes";
import { settings } from "../../settings/_routes";
import { useAppSettingsContext } from "../../_contexts/settings/AppSettingsContext";
import { useAuthContext } from "../../_contexts/AuthContext";

import PrimaryNavLink from "./PrimaryNavLink";
import ThemeSelector from "./ThemeSelector";
import PrimaryNavCollapseButton from "./PrimaryNavCollapseButton";
import UserInfo from "./UserInfo";
import { useBarTooltips } from "../tooltip/TooltipPlacement";

const PrimaryNav: Component = () => {
    const [authContext] = useAuthContext();
    const [state] = useAppSettingsContext();
    // down the left edge from `md` up, so tooltips open to the right; across
    // the top below it, so downwards
    const tooltips = useBarTooltips("right", "bottom");

    return (
        <nav
            {...tooltips()}
            /*
               A landmark, not a bare div. This is the one way around the
               application, so it is the first thing a screen reader should be
               able to jump to - and it was indistinguishable from any other box.
            */
            aria-label="Primary"
            class="flex md:flex-col border-b md:border-r border-base-content/30 bg-linear-to-b from-base-300 to-base-200 shadow-md shadow-base-300/40 z-30"
        >
            <PrimaryNavLink showTitle={state.navExpanded} route={categories} />
            <PrimaryNavLink showTitle={state.navExpanded} route={people} />
            <PrimaryNavLink showTitle={state.navExpanded} route={places} />
            <PrimaryNavLink showTitle={state.navExpanded} route={search} />
            <PrimaryNavLink showTitle={state.navExpanded} route={randomMediaRoutes} />
            <PrimaryNavLink showTitle={state.navExpanded} route={stats} />

            <span class="grow" />

            <Show when={authContext.isLoggedIn}>
                <UserInfo showTitle={state.navExpanded} />

                <div class="divider my-0 h-auto" />
            </Show>

            <ThemeSelector showTitle={state.navExpanded} />
            <PrimaryNavLink showTitle={state.navExpanded} route={about} />
            <PrimaryNavLink showTitle={state.navExpanded} route={settings} />

            <div class="divider my-0 h-auto" />

            <PrimaryNavCollapseButton />
        </nav>
    );
};

export default PrimaryNav;
