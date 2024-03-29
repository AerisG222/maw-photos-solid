import { Component, For } from "solid-js"
import { KeyValuePair } from "../../_models/KeyValuePair";

type Props<T> = {
    horizontal: boolean;
    title: string;
    itemArray: KeyValuePair<T>[];
    selectedValue: T;
    onChange: (value: string) => void;
};

const Select: Component<Props<string|number>> = (props) => {
    return(
        <div class="form-control max-w-16rem"
            classList={{
                "flex-row": props.horizontal,
                "w-full": props.horizontal,
                "flex-col": !props.horizontal
        }}>
            <label class="label flex-grow">
                <span class="label-text color-secondary font-bold">{props.title}</span>
            </label>
            <select name="theme" class="select select-sm select-bordered min-w-8rem flex-grow" value={props.selectedValue} onChange={evt => props.onChange(evt.currentTarget.value)}>
                <For each={props.itemArray}>{ item =>
                    <option value={item.id} selected={item.id===props.selectedValue}>{item.name}</option>
                }</For>
            </select>
        </div>
    );
};

export default Select;
