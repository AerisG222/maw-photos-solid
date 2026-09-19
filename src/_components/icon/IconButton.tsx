import { children, ParentComponent, Show } from "solid-js";

import { getNameWithShortcut } from "../shortcuts/_util";

import Tooltip from "../tooltip/Tooltip";
import { Placement } from "../tooltip/TooltipPlacement";

interface Props {
    /*
       What this does, for anybody not looking at the icon. Required rather than
       optional: the contents are an icon and nothing else, so without it the
       button announces itself as "button" - and this is what draws the
       favorite heart on every tile in the application.
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
    /*
       The styled tooltip, which shows on keyboard focus and draws the key as a
       key, in place of the browser's `title`. Opt-in, because this is also the
       heart on every tile of a listing - thousands of them, where the native
       tooltip costs nothing - while one on the open photograph is worth it.
    */
    styledTooltip?: boolean;
    // which side the styled tooltip opens on; below, unless said otherwise
    tooltipPlacement?: Placement;
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
        <Show
            when={props.styledTooltip}
            fallback={
                <button
                    class={`btn btn-circle ${props.buttonClasses}`}
                    aria-label={props.label}
                    title={getNameWithShortcut(props.label, props.shortcutKeys)}
                    onClick={evt => handleClick(evt)}
                >
                    {c()}
                </button>
            }
        >
            <Tooltip
                as="button"
                content={props.label}
                shortcutKeys={props.shortcutKeys}
                placement={props.tooltipPlacement}
                class={`btn btn-circle ${props.buttonClasses}`}
                aria-label={props.label}
                onClick={(evt: MouseEvent) => handleClick(evt)}
            >
                {c()}
            </Tooltip>
        </Show>
    );
};

export default IconButton;
