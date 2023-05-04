import { ParentComponent } from 'solid-js';

export type Props = {
    icon: string;
    title: string;
}

const InfoCard: ParentComponent<Props> = (props) => {
    const c = () => props.children;

    return (
        <div class="bg-primaryContent rounded m-1 p-2 border-1 border-secondary-content:10%">
            <div>
                <span class={`text-6 ${props.icon}`} /> - {props.title}
            </div>

            <div class="m-t-2">
                {c()}
            </div>
        </div>
    )
}

export default InfoCard;