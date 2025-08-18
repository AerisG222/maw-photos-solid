import { Component, For } from "solid-js";
import { KeyValuePair } from "../../_models/KeyValuePair";

type Props<T> = {
    horizontal: boolean;
    title: string;
    itemArray: KeyValuePair<T>[];
    selectedValue: T;
    onChange: (value: string) => void;
};

const Select: Component<Props<string | number>> = props => {
    return (
        <fieldset class="fieldset">
            <legend class="fieldset-legend text-sm text-secondary font-bold">{props.title}</legend>
            <select
                name="theme"
                class="select min-w-[10rem]"
                value={props.selectedValue}
                onChange={evt => props.onChange(evt.currentTarget.value)}
            >
                <For each={props.itemArray}>
                    {item => (
                        <option value={item.id} selected={item.id === props.selectedValue}>
                            {item.name}
                        </option>
                    )}
                </For>
            </select>
        </fieldset>
    );
};

export default Select;
