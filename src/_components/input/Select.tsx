import { Component, For, Show } from "solid-js";
import { KeyValuePair } from "../../_models/KeyValuePair";

interface Props<T> {
    title: string;
    itemArray: KeyValuePair<T>[];
    selectedValue: T;
    onChange: (value: string) => void;
    // the label beside the control rather than above it, for a row of them
    inline?: boolean;
}

const Select: Component<Props<string | number>> = props => {
    const control = () => (
        <select
            class="select min-w-[10rem]"
            classList={{ "w-auto": !!props.inline }}
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
    );

    // a legend will not sit beside what it labels, so this one is a label
    return (
        <Show
            when={props.inline}
            fallback={
                <fieldset class="fieldset">
                    <legend class="fieldset-legend text-sm text-secondary font-bold">
                        {props.title}
                    </legend>
                    {control()}
                </fieldset>
            }
        >
            <label class="flex items-center gap-2">
                <span class="text-sm text-secondary font-bold">{props.title}</span>
                {control()}
            </label>
        </Show>
    );
};

export default Select;
