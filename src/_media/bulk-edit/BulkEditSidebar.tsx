import { Component, For, Show, createSignal } from "solid-js";

import { GpsCoordinate } from "../../_models/GpsCoordinate";

import InfoCard from "../../_components/inspector/InspectorCard";
import InspectorRail from "../../_components/inspector/InspectorRail";
import InspectorRailButton from "../../_components/inspector/InspectorRailButton";
import SidePanel, { usePanelShape } from "../../_components/overlay/SidePanel";
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
   three shapes: a hard `w-[500px]` handed to the layout's sidebar slot. On a
   phone that is a panel wider than the screen sitting *in flow*, so the layout's
   bottom row stretched to the height of the cards and took the navigation with
   it - which is exactly how it was reported.

   Docked it is simply there, as it always was. Overlaid it needs a way in, so
   the rail carries one button, matching the Inspector's.
*/
const BulkEditSidebar: Component<Props> = props => {
    const { docked } = usePanelShape();
    const [open, setOpen] = createSignal(false);

    // beside the content there is nothing to open or close; over it there is
    const isOpen = () => docked() || open();

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
            <SidePanel open={isOpen()} onClose={() => setOpen(false)} title="Bulk Edit Tools">
                <For each={cards}>
                    {card => (
                        <InfoCard title={card.title} icon={card.icon}>
                            {card.component}
                        </InfoCard>
                    )}
                </For>
            </SidePanel>

            {/*
                Only where the panel is not simply there. Docked it cannot be
                closed - which is how this screen has always behaved on a wide
                display - so a button offering to close it would be a button
                that does nothing.
            */}
            <Show when={!docked()}>
                <InspectorRail>
                    <InspectorRailButton
                        name="Tools"
                        tooltip="Show / Hide the Bulk Edit Tools"
                        icon={
                            open()
                                ? "icon-[ic--round-chevron-right]"
                                : "icon-[ic--round-chevron-left]"
                        }
                        shortcutKeys={["i"]}
                        clickHandler={() => setOpen(!open())}
                    />
                </InspectorRail>
            </Show>
        </div>
    );
};

export default BulkEditSidebar;
