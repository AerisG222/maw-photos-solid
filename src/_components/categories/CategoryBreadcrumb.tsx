import { Component, Show } from "solid-js";
import { Link } from "@tanstack/solid-router";

import { Category } from "../../_models/Category";

interface Props {
    showTitleAsLink?: boolean;
    category?: Category;
}

const CategoryBreadcrumb: Component<Props> = props => {
    return (
        <Show when={props.category}>
            <div class="text-center">
                <Link
                    class="text-primary hover:underline"
                    to="/categories"
                    search={{ year: props.category!.effectiveDate.getFullYear() }}
                >
                    {props.category!.effectiveDate.getFullYear()}
                </Link>

                <span class="text-xl align-middle icon-[ic--round-arrow-right]" />

                <Show when={props.showTitleAsLink}>
                    <Link
                        class="text-primary hover:underline"
                        to="/categories/$categoryYear/$categorySlug"
                        params={{
                            categoryYear: String(props.category!.year),
                            categorySlug: props.category!.slug
                        }}
                    >
                        {props.category!.name}
                    </Link>
                </Show>
                <Show when={!props.showTitleAsLink}>
                    <span>{props.category!.name}</span>
                </Show>
            </div>
        </Show>
    );
};

export default CategoryBreadcrumb;
