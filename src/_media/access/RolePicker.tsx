import { Component, For } from "solid-js";

import Checkbox from "../../_components/input/Checkbox";

interface Props {
    roles: string[];
    selected: string[];
    onChange: (selected: string[]) => void;
}

// one box per role, since a restriction is a set of them rather than a level
const RolePicker: Component<Props> = props => {
    const toggle = (role: string, isSelected: boolean) =>
        props.onChange(
            isSelected
                ? props.roles.filter(r => r === role || props.selected.includes(r))
                : props.selected.filter(r => r !== role)
        );

    return (
        <For each={props.roles}>
            {role => (
                <Checkbox
                    title={role}
                    name={`role-${role}`}
                    isSelected={props.selected.includes(role)}
                    onChange={isSelected => toggle(role, isSelected)}
                />
            )}
        </For>
    );
};

export default RolePicker;
