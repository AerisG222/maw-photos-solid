import { Component, For } from 'solid-js'
import { KeyValuePair } from '../../models/key-value-pair';

export type Props<T> = {
    title: string,
    groupName: string,
    itemArray: KeyValuePair<T>[],
    selectedValue: T,
    onChange: (evt: Event) => void
};

const RadioGroup: Component<Props<string|number>> = (props) => {
    return(
        <>
            <h3>{props.title}</h3>
            <For each={props.itemArray}>{(item, i) =>
                <div class="form-control">
                    <label class="label cursor-pointer justify-start">
                        <input type="radio" name={props.groupName} value={item.id} checked={item.id === props.selectedValue} class="radio mr-3" onChange={evt => props.onChange(evt)} />
                        <span class="label-text">{item.name}</span>
                    </label>
                </div>
            }</For>
        </>
    );
}

export default RadioGroup;
