import { Component, For } from "solid-js";

import { GpsCoordinate } from "../../_models/GpsCoordinate";

import InfoCard from "../../_components/inspector/InspectorCard";
import SidePanel from "../../_components/overlay/SidePanel";
import BulkEditFilterCard from "./BulkEditFilterCard";
import BulkEditGpsCard from "./BulkEditGpsCard";

interface Props {
    onSave: (gps: GpsCoordinate) => void;
    onHideMediaWithGps: (hide: boolean) => void;
    onSelectAll: () => void;
    onDeselectAll: () => void;
}

/*
   Bulk edit's tools, in the same panel the Inspector uses.

   This was a second copy of what the Inspector had been before it learned to be
   three shapes: a hard `w-[500px]` handed to the layout's sidebar slot. In flow
   on a 390px viewport that stretched the layout's bottom row to the height of
   the cards and squeezed the chrome beside it to nothing.

   It only ever renders docked now - the view itself is not offered anywhere the
   panel would have to overlay, because reading a selection while typing
   coordinates for it needs both on screen at once. So there is no open state
   and no rail: `SidePanel` is here for the one shape, and for not being a
   second implementation of it.
*/
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
            <SidePanel open onClose={() => undefined} title="Bulk Edit Tools">
                <For each={cards}>
                    {card => (
                        <InfoCard title={card.title} icon={card.icon}>
                            {card.component}
                        </InfoCard>
                    )}
                </For>
            </SidePanel>
        </div>
    );
};

export default BulkEditSidebar;
