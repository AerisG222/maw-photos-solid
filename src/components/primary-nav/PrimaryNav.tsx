import { Component } from "solid-js";

import { categories } from "../../categories/_routes";
import { search } from "../../search/_routes";
import { random } from "../../random/_routes";
import { stats } from "../../stats/_routes";
import { about } from "../../about/_routes";
import { settings } from "../../settings/_routes";

import PrimaryNavLink from "./PrimaryNavLink";

const PrimaryNav: Component = () => {
    return (
        <div class="flex md:flex-col bg-secondary-content:12 border-r-1 border-r-secondary-content:10%">
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
