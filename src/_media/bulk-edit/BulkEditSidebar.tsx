import { Component, For } from "solid-js";

import { GpsCoordinate } from "../../_models/GpsCoordinate";

import InfoCard from "../../_components/sidebar/InfoCard";
import BulkEditFilterCard from "./BulkEditFilterCard";
import BulkEditGpsCard from "./BulkEditGpsCard";

interface Props {
    onSave: (gps: GpsCoordinate) => void;
    onHideMediaWithGps: (hide: boolean) => void;
    onSelectAll: () => void;
    onDeselectAll: () => void;
}

const BulkEditSidebar: Component<Props> = props => {
    const cards = [
        {
            title: "Filter/Selection Tools",
            icon: "icon-[ic--round-filter-alt]",
            component: (
                <BulkEditFilterCard
                    onSelectAll={props.onSelectAll}
                    onDeselectAll={props.onDeselectAll}
                    onHideMediaWithGps={props.onHideMediaWithGps}
                />
            )
        },
        {
            title: "GPS",
            icon: "icon-[ic--round-place]",
            component: <BulkEditGpsCard onSave={props.onSave} />
        }
    ];

    return (
        <div class="flex">
            <div class="w-[500px] bg-base-200 border-l-1 border-l-base-content:30% overflow-y-auto overflow-x-hidden scrollable">
                <For each={cards}>
                    {card => (
                        <InfoCard title={card.title} icon={card.icon}>
                            {card.component}
                        </InfoCard>
                    )}
                </For>
            </div>
        </div>
    );
};

export default BulkEditSidebar;
