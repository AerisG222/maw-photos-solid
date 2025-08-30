import { Component, Show } from "solid-js";
import { A } from "@solidjs/router";

import { statsSummary } from "../_routes";

import Icon from "../../_components/icon/Icon";

type Props = {
    year: string | undefined;
    type?: string | undefined;
    mode?: string | undefined;
};

const Header: Component<Props> = props => {
    return (
        <>
            <div class="flex text-secondary font-bold">
                <Show when={props.year} fallback={<h3>Stats</h3>}>
                    <A
                        class="text-primary"
                        href={`${statsSummary.absolutePath}?type=${props.type}&mode=${props.mode}`}
                    >
                        Stats
                    </A>
                    <Icon classes="text-lg icon-[ic--sharp-keyboard-arrow-right]" />
                    <h3>{props.year}</h3>
                </Show>
            </div>
        </>
    );
};

export default Header;
