import { Component } from "solid-js";

import Checkbox from "../../_components/input/Checkbox";

interface Props {
    onHideMediaWithGps: (hide: boolean) => void;
    onSelectAll: () => void;
    onDeselectAll: () => void;
}

const BulkEditFilterCard: Component<Props> = props => {
    const onSelectAll = (evt: Event) => {
        evt.preventDefault();

        props.onSelectAll();
    };

    const onDeselectAll = (evt: Event) => {
        evt.preventDefault();

        props.onDeselectAll();
    };

    return (
        <div class="mx-4">
            <div>
                <Checkbox
                    name="hideGps"
                    title="Hide Photos with GPS Data"
                    isSelected={false}
                    onChange={props.onHideMediaWithGps}
                />
            </div>

            <div class="mt-4">
                <button class="btn btn-sm mr-2" onClick={onSelectAll}>
                    Select All
                </button>
                <button class="btn btn-sm" onClick={onDeselectAll}>
                    Deselect All
                </button>
            </div>
        </div>
    );
};

export default BulkEditFilterCard;
