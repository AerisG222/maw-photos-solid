import { Component, Show } from "solid-js";
import { A } from "@solidjs/router";

import { Category } from "../../_models/Category";

interface Props {
    showTitleAsLink?: boolean;
    category?: Category;
}

const CategoryBreadcrumb: Component<Props> = props => {
    return (
        <Show when={props.category}>
            <div class="text-center">
                <A
                    class="text-primary"
                    href={`/categories?year=${props.category!.effectiveDate.getFullYear()}`}
                >
                    {props.category!.effectiveDate.getFullYear()}
                </A>

                <span class="text-xl align-middle icon-[ic--round-arrow-right]" />

                <Show when={props.showTitleAsLink}>
                    <A class="text-primary" href={`/categories/${props.category!.id}`}>
                        {props.category!.name}
                    </A>
                </Show>
                <Show when={!props.showTitleAsLink}>
                    <span>{props.category!.name}</span>
                </Show>
            </div>
        </Show>
    );
};

export default CategoryBreadcrumb;
