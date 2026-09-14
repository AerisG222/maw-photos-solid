import { children, ParentComponent } from "solid-js";

interface Props {
    /*
       What this does, for anybody not looking at the icon. Required rather than
       optional: the contents are an icon and nothing else, so without it the
       button announces itself as "button" - and this is what draws the
       favourite heart on every tile in the application.
    */
    label: string;
    buttonClasses?: string;
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
            class={`btn btn-circle ${props.buttonClasses}`}
            aria-label={props.label}
            title={props.label}
            onClick={evt => handleClick(evt)}
        >
            {c()}
        </button>
    );
};

export default IconButton;
