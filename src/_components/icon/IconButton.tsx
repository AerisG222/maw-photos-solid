import { children, ParentComponent } from "solid-js";

import { getNameWithShortcut } from "../shortcuts/_util";

interface Props {
    /*
       What this does, for anybody not looking at the icon. Required rather than
       optional: the contents are an icon and nothing else, so without it the
       button announces itself as "button" - and this is what draws the
       favourite heart on every tile in the application.
    */
    label: string;
    /*
       Named in the tooltip but not in the accessible name, which is the split
       every toolbar control here already makes: a screen reader announces the
       action and reads the key from its own bindings, while a pointer user has
       no other way to discover one.

       It does not register anything. The key is bound elsewhere - this only
       says so - so passing it where nothing listens would be a lie told
       politely.
    */
    shortcutKeys?: string[];
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
            title={getNameWithShortcut(props.label, props.shortcutKeys)}
            onClick={evt => handleClick(evt)}
        >
            {c()}
        </button>
    );
};

export default IconButton;
