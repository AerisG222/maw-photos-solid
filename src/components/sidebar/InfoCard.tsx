import { ParentComponent, children } from 'solid-js';

type Props = {
    icon: string;
    title: string;
};

const InfoCard: ParentComponent<Props> = (props) => {
    const c = children(() => props.children);

    return (
        <div class="bg-base-300 rounded m-1 p-2 border-1 border-secondary:20%">
            <div class="color-secondary">
                <span class={`m-r-2 text-6 ${props.icon}`} />
                <strong class="text-3.5">{props.title}</strong>
            </div>

            <div class="m-t-2">
                {c()}
            </div>
        </div>
    );
};

export default InfoCard;
