import { Component, For } from "solid-js";

import InfoCard from './InfoCard';
import BulkEditFilterCard from './BulkEditFilterCard';
import BulkEditGpsCard from './BulkEditGpsCard';

type Props = {
    onSave: (gps: GpsOverride) => void;
};

const BulkEditSidebar: Component<Props> = (props) => {
    const cards = [
        {
            title: "Filter/Selection Tools",
            icon: "i-ic-round-filter-list",
            component: <BulkEditFilterCard />
        },
        {
            title: "GPS",
            icon: "i-ic-round-place",
            component: <BulkEditGpsCard onSave={props.onSave}/>
        }
    ];

    return (
        <div class="flex">
            <div class="w-[500px] bg-secondary-content:6 border-l-1 border-l-secondary-content:10% overflow-y-auto overflow-x-hidden">
                <For each={cards}>{ card =>
                    <InfoCard title={card.title} icon={card.icon}>
                        {card.component}
                    </InfoCard>
                }</For>
            </div>
        </div>
    );
};

export default BulkEditSidebar;
