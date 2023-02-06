import { Component } from "solid-js";
import PrimaryNavLink from './PrimaryNavLink';

const PrimaryNav: Component = () => {
    return <ul>
            <li><PrimaryNavLink icon="i-ic-round-home" name="Home" url="/" /></li>
            <li><PrimaryNavLink icon="i-ic-round-search" name="Search" url="/search" /></li>
            <li><PrimaryNavLink icon="i-ic-round-shuffle" name="Random" url="/random" /></li>
            <li><PrimaryNavLink icon="i-ic-round-bar-chart" name="Statistics" url="/stats" /></li>

            <li><PrimaryNavLink icon="i-ic-outline-info" name="About" url="/about" /></li>
            <li><PrimaryNavLink icon="i-ic-baseline-settings" name="Settings" url="/settings" /></li>
        </ul>;
};

export default PrimaryNav;
