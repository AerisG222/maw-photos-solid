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

const PrimaryNav: Component = () => {
    const [authContext] = useAuthContext();
    const [state] = useAppSettingsContext();

    return (
        <div
            class="flex md:flex-col border-b md:border-r border-base-content/30
                bg-linear-to-b from-base-300 to-base-200 shadow-md shadow-base-300/40 z-30"
        >
            <PrimaryNavLink showTitle={!state.isPrimaryNavCollapsed} route={categories} />
            <PrimaryNavLink showTitle={!state.isPrimaryNavCollapsed} route={people} />
            <PrimaryNavLink showTitle={!state.isPrimaryNavCollapsed} route={places} />
            <PrimaryNavLink showTitle={!state.isPrimaryNavCollapsed} route={search} />
            <PrimaryNavLink showTitle={!state.isPrimaryNavCollapsed} route={randomMediaRoutes} />
            <PrimaryNavLink showTitle={!state.isPrimaryNavCollapsed} route={stats} />

            <span class="grow" />

            <Show when={authContext.isLoggedIn}>
                <UserInfo showTitle={!state.isPrimaryNavCollapsed} />

                <div class="divider my-0 h-auto" />
            </Show>

            <ThemeSelector showTitle={!state.isPrimaryNavCollapsed} />
            <PrimaryNavLink showTitle={!state.isPrimaryNavCollapsed} route={about} />
            <PrimaryNavLink showTitle={!state.isPrimaryNavCollapsed} route={settings} />

            <div class="divider my-0 h-auto" />

            <PrimaryNavCollapseButton />
        </div>
    );
};

export default PrimaryNav;
