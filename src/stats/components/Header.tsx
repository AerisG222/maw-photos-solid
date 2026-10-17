import { Component, Show } from "solid-js";
import { Link } from "@tanstack/solid-router";

import { StatsSearch } from "../_search";

import Icon from "../../_components/icon/Icon";

interface Props {
    year: string | undefined;
    // carried back to the summary, so it opens the way the year was being looked at
    search?: StatsSearch;
}

const Header: Component<Props> = props => {
    return (
        <>
            <div class="flex text-secondary font-bold">
                <Show when={props.year} fallback={<h3>Stats</h3>}>
                    <Link class="text-primary" to="/stats/summary" search={props.search ?? {}}>
                        Stats
                    </Link>
                    <Icon classes="text-lg icon-[ic--round-keyboard-arrow-right]" />
                    <h3>{props.year}</h3>
                </Show>
            </div>
        </>
    );
};

export default Header;
