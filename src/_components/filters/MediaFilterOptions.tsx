import { Component } from "solid-js";

import { MediaFilters, MediaTypeFilter } from "../../_models/MediaFilters";

import Checkbox from "../input/Checkbox";
import RadioGroup from "../input/RadioGroup";

interface Props {
    filters: MediaFilters;
    onChange: (changes: MediaFilters) => void;
    // what favorites means here - a category's own flag, or a photo's
    favoritesLabel?: string;
}

const mediaTypes = [
    { id: "all", name: "All" },
    { id: "photo", name: "Photos" },
    { id: "video", name: "Videos" }
];

// one choice rather than two checkboxes: both ticked would mean nothing
const MediaFilterOptions: Component<Props> = props => (
    <>
        <Checkbox
            title={props.favoritesLabel ?? "Favorites"}
            name="filter-favorites"
            isSelected={!!props.filters.f}
            onChange={f => props.onChange({ f: f || undefined })}
        />

        <RadioGroup
            title="Type"
            groupName="filter-type"
            itemArray={mediaTypes}
            selectedValue={props.filters.t ?? "all"}
            onChange={t => props.onChange({ t: t === "all" ? undefined : (t as MediaTypeFilter) })}
        />
    </>
);

export default MediaFilterOptions;
