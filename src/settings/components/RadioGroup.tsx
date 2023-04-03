import { Component, For } from 'solid-js'
import { KeyValuePair } from '../../models/key-value-pair';

export type Props<T> = {
    title: string,
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
                    <label class="label cursor-pointer">
                        <span class="label-text">{item.name}</span>
                        <input type="radio" name="typeFilter" value={item.id} class="radio" onChange={evt => props.onChange(evt)} />
                    </label>
                </div>
            }</For>
        </>
    );
}

export default RadioGroup;
