import { Component, Show } from "solid-js";

import { areas } from "../../areas";
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
    /*
       `z-45`, above the page and everything it floats: an open photograph is
       `z-30` and the overlaid side panels `z-40`, and at the old `z-30` the
       photograph tied with the nav and won by coming later - so the account
       menu, which opens out over the page, opened underneath it. Dialogs
       (`z-50`) still cover it, as they should, and fullscreen hides it.
    */
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
            class="flex md:flex-col border-b md:border-r border-base-content/30 bg-linear-to-b from-base-300 to-base-200 shadow-md shadow-base-300/40 z-45"
        >
            <PrimaryNavLink
                showTitle={state.navExpanded}
                route={areas.categories.display}
                link={areas.categories.link}
            />
            <PrimaryNavLink
                showTitle={state.navExpanded}
                route={areas.people.display}
                link={areas.people.link}
            />
            <PrimaryNavLink
                showTitle={state.navExpanded}
                route={areas.places.display}
                link={areas.places.link}
            />
            <PrimaryNavLink
                showTitle={state.navExpanded}
                route={areas.search.display}
                link={areas.search.link}
            />
            <PrimaryNavLink
                showTitle={state.navExpanded}
                route={areas.random.display}
                link={areas.random.link}
            />
            <PrimaryNavLink
                showTitle={state.navExpanded}
                route={areas.stats.display}
                link={areas.stats.link}
            />

            <span class="grow" />

            <Show when={authContext.isLoggedIn}>
                <UserInfo showTitle={state.navExpanded} />

                <div class="divider my-0 h-auto" />
            </Show>

            <ThemeSelector showTitle={state.navExpanded} />
            <PrimaryNavLink
                showTitle={state.navExpanded}
                route={areas.about.display}
                link={areas.about.link}
            />
            <PrimaryNavLink
                showTitle={state.navExpanded}
                route={areas.settings.display}
                link={areas.settings.link}
            />

            <div class="divider my-0 h-auto" />

            <PrimaryNavCollapseButton />
        </nav>
    );
};

export default PrimaryNav;
