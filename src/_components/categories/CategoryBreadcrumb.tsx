import { Component, Show } from "solid-js";
import { A } from "@solidjs/router";

import { useCategoryContext } from "../../_contexts/CategoryContext";

type Props = {
    showTitleAsLink?: boolean;
};

const CategoryBreadcrumb: Component<Props> = props => {
    const [state] = useCategoryContext();

    return (
        <Show when={state.activeCategory}>
            <div class="text-center">
                <A class="text-primary" href={`/categories?year=${state.activeCategory.year}`}>
                    {state.activeCategory.year}
                </A>

                <span class="text-6 icon-[ic--round-arrow-right]" />

                <Show when={props.showTitleAsLink}>
                    <A
                        class="text-primary"
                        href={`/categories/${state.activeCategory.type}/${state.activeCategory.id}`}
                    >
                        {state.activeCategory.name}
                    </A>
                </Show>
                <Show when={!props.showTitleAsLink}>
                    <span>{state.activeCategory.name}</span>
                </Show>
            </div>
        </Show>
    );
};

export default CategoryBreadcrumb;
