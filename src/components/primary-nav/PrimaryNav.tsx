import { Component } from "solid-js";

import { categories } from "../../categories/_routes";
import { search } from "../../search/_routes";
import { randomMediaRoutes } from "../../media/_routes";
import { stats } from "../../stats/_routes";
import { about } from "../../about/_routes";
import { settings } from "../../settings/_routes";

import PrimaryNavLink from "./PrimaryNavLink";
import ThemeSelector from './ThemeSelector';

const PrimaryNav: Component = () => {
    return (
        <div class="flex md:flex-col bg-base-300 border-b-1 md:border-r-1 border-base-content:30%">
            <PrimaryNavLink route={categories} />
            <PrimaryNavLink route={search} />
            <PrimaryNavLink route={randomMediaRoutes} />
            <PrimaryNavLink route={stats} />

            <span class="flex-grow" />

            <ThemeSelector />
            <PrimaryNavLink route={about} />
            <PrimaryNavLink route={settings} />
        </div>
    );
};

export default PrimaryNav;
