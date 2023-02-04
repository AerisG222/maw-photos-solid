import { Component } from "solid-js";
import PrimaryNavLink from './PrimaryNavLink';

const PrimaryNav: Component = () => {
    return <ul>
            <li><PrimaryNavLink icon="i-mdi-home" name="Home" url="/" /></li>
            <li><PrimaryNavLink icon="i-mdi-about-circle-outline" name="About" url="/about" /></li>
        </ul>;
};

export default PrimaryNav;
