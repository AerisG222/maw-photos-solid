import { children, ParentComponent } from "solid-js";

import IconButton from "./IconButton";

interface Props {
    onClick: () => void;
}

const FloatingIconButton: ParentComponent<Props> = props => {
    const c = children(() => props.children);

    return (
        <>
            <div class="relative">
                <IconButton
                    buttonClasses={"absolute top-[2px] right-[2px] z-1 text-primary btn-xs"}
                    onClick={props.onClick}
                >
                    {c()}
                </IconButton>
            </div>
        </>
    );
};

export default FloatingIconButton;
