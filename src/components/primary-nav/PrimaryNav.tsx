import { Component } from "solid-js";
import { home, search, random, stats, about, settings } from "../../routes";
import PrimaryNavLink from "./PrimaryNavLink";

const PrimaryNav: Component = () => {
    return (
        <div class="flex md:flex-col">
            <PrimaryNavLink
                icon={home.icon}
                name={home.name}
                url={home.path}
            />
            <PrimaryNavLink
                icon={search.icon}
                name={search.name}
                url={search.path}
            />
            <PrimaryNavLink
                icon={random.icon}
                name={random.name}
                url={random.path}
            />
            <PrimaryNavLink
                icon={stats.icon}
                name={stats.name}
                url={stats.path}
            />

            <span class="flex-grow" />

            <PrimaryNavLink
                icon={about.icon}
                name={about.name}
                url={about.path}
            />
            <PrimaryNavLink
                icon={settings.icon}
                name={settings.name}
                url={settings.path}
            />
        </div>
    );
};

export default PrimaryNav;
