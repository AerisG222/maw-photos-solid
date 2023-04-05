import { Component } from "solid-js";

interface Props {
    icon: string;
    name: string;
    rotate90?: boolean;
    clickHandler: () => void;
}

const ToolbarButton: Component<Props> = (props) => {
    const handleClick = (data: any, evt: Event) => {
        evt.preventDefault();

        props.clickHandler();
    }

    return (
        <button
            class="px-3 py-1 hover:text-red-7 hover:bg-red-1"
            classList={{"rotate-90": props.rotate90}}
            title={props.name}
            onClick={[handleClick, null]}
        >
            <span class={`text-6 ${props.icon}`} />
        </button>
    );
};

export default ToolbarButton;
