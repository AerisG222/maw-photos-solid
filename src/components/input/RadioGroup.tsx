import { Component, For } from 'solid-js'
import { KeyValuePair } from '../../_models/KeyValuePair';

type Props<T> = {
    title: string;
    groupName: string;
    itemArray: KeyValuePair<T>[];
    selectedValue: T;
    onChange: (value: string) => void;
};

const RadioGroup: Component<Props<string|number>> = (props) => {
    return(
        <>
            <h3 class="color-secondary">{props.title}</h3>
            <For each={props.itemArray}>{ item =>
                <div class="form-control">
                    <label class="label cursor-pointer justify-start">
                        <input type="radio" name={props.groupName} value={item.id} checked={item.id === props.selectedValue} class="radio mr-3" onChange={evt => props.onChange(evt.currentTarget.value)} />
                        <span class="label-text">{item.name}</span>
                    </label>
                </div>
            }</For>
        </>
    );
};

export default RadioGroup;
