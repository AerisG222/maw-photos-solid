import { Component } from "solid-js";
import { home, search, random, stats, about, settings } from '../routes';
import PrimaryNavLink from './PrimaryNavLink';

const PrimaryNav: Component = () => {
    return <ul>
            <li><PrimaryNavLink icon={home.icon} name={home.name} url={home.path} /></li>
            <li><PrimaryNavLink icon={search.icon} name={search.name} url={search.path} /></li>
            <li><PrimaryNavLink icon={random.icon} name={random.name} url={random.path} /></li>
            <li><PrimaryNavLink icon={stats.icon} name={stats.name} url={stats.path} /></li>

            <li><PrimaryNavLink icon={about.icon} name={about.name} url={about.path} /></li>
            <li><PrimaryNavLink icon={settings.icon} name={settings.name} url={settings.path} /></li>
        </ul>;
};

export default PrimaryNav;
