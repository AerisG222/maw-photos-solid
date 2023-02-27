import { Component } from "solid-js";
import { categories, search, random, stats, about, settings } from "../../routes";
import PrimaryNavLink from "./PrimaryNavLink";

const PrimaryNav: Component = () => {
    return (
        <div class="flex md:flex-col">
            <PrimaryNavLink route={categories} />
            <PrimaryNavLink route={search} />
            <PrimaryNavLink route={random} />
            <PrimaryNavLink route={stats} />

            <span class="flex-grow" />

            <PrimaryNavLink route={about} />
            <PrimaryNavLink route={settings} />
        </div>
    );
};

export default PrimaryNav;
