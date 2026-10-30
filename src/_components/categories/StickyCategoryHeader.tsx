import { Component, Show } from "solid-js";
import { Link } from "@tanstack/solid-router";

import { Category } from "../../_models/Category";
import { categoriesRoute } from "../../categories/_routeTree";

import PageHeader from "../layout/PageHeader";

interface Props {
    category?: Category;
}

// the category's name, with its year ahead of it as the link back out
const StickyCategoryHeader: Component<Props> = props => (
    <Show when={props.category}>
        {category => (
            <PageHeader
                title={
                    <>
                        <Link
                            class="text-secondary hover:underline"
                            to={categoriesRoute.to}
                            search={{ year: category().effectiveDate.getFullYear() }}
                        >
                            {category().effectiveDate.getFullYear()}
                        </Link>
                        <span class="mx-1 align-middle opacity-60 icon-[ic--round-chevron-right]" />
                        {category().name}
                    </>
                }
            />
        )}
    </Show>
);

export default StickyCategoryHeader;
