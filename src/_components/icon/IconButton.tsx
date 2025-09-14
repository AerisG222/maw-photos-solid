import { children, ParentComponent } from "solid-js";

interface Props {
    buttonClasses: string;
    onClick: () => void;
}

const IconButton: ParentComponent<Props> = props => {
    const c = children(() => props.children);

    const handleClick = (evt: MouseEvent) => {
        evt.preventDefault();
        evt.stopPropagation();

        if (props.onClick) {
            props.onClick();
        }
    };

    return (
        <button
            class={`btn btn-xs btn-circle ${props.buttonClasses}`}
            onClick={evt => handleClick(evt)}
        >
            {c()}
        </button>
    );
};

export default IconButton;
