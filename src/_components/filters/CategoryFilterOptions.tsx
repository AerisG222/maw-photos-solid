import { Component, Show } from "solid-js";

import { useAuthContext } from "../../_contexts/AuthContext";
import type { CategoryFilters } from "../../categories/_search";

import Checkbox from "../input/Checkbox";
import MediaFilterOptions from "./MediaFilterOptions";

interface Props {
    filters: CategoryFilters;
    onChange: (changes: CategoryFilters) => void;
}

const CategoryFilterOptions: Component<Props> = props => {
    const [state] = useAuthContext();

    return (
        <>
            <MediaFilterOptions filters={props.filters} onChange={props.onChange} />

            <Show when={state.accountStatus?.isAdmin}>
                <h3 class="head3 mt-3">Admin</h3>

                <Checkbox
                    title="Missing GPS"
                    name="missing_gps"
                    isSelected={!!props.filters.noGps}
                    onChange={noGps => props.onChange({ noGps: noGps || undefined })}
                />

                {/* the categories holding a restricted photo - including any hidden from you */}
                <Checkbox
                    title="Restricted"
                    name="restricted"
                    isSelected={!!props.filters.restricted}
                    onChange={restricted => props.onChange({ restricted: restricted || undefined })}
                />
            </Show>
        </>
    );
};

export default CategoryFilterOptions;
