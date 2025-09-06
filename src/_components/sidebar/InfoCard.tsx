import { ParentComponent, children } from "solid-js";

interface Props {
    icon: string;
    title: string;
}

const InfoCard: ParentComponent<Props> = props => {
    const c = children(() => props.children);

    return (
        <div class="bg-base-300 rounded m-1 p-2 border-1 border-secondary/20 max-h-164 overflow-y-scroll">
            <div class="flex flex-items-center text-secondary">
                <span class={`block mr-2 text-6 ${props.icon}`} />
                <span class="block text-sm font-bold">{props.title}</span>
            </div>

            <div class="mt-2">{c()}</div>
        </div>
    );
};

export default InfoCard;
