import { Component, Show } from "solid-js";
import { Link } from "@tanstack/solid-router";

import { StatsSearch } from "../_search";

import PageHeader from "../../_components/layout/PageHeader";
import { statsSummaryRoute } from "../_routeTree";

interface Props {
    year: string | undefined;
    // carried back to the summary, so it opens the way the year was being looked at
    search?: StatsSearch;
}

// in a page that fills the screen and does not scroll, so there is nothing to stick to
const Header: Component<Props> = props => (
    <PageHeader
        pinned={false}
        title={
            <Show when={props.year} fallback="Stats">
                <Link
                    class="text-secondary hover:underline"
                    to={statsSummaryRoute.to}
                    search={props.search ?? {}}
                >
                    Stats
                </Link>
                <span class="mx-1 align-middle opacity-60 icon-[ic--round-chevron-right]" />
                {props.year}
            </Show>
        }
    />
);

export default Header;
