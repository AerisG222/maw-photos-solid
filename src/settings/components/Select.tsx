import { Component, For } from 'solid-js'
import { KeyValuePair } from '../../models/key-value-pair';

export type Props<T> = {
    title: string,
    itemArray: KeyValuePair<T>[],
    selectedValue: T,
    onChange: (evt: Event) => void
};

const Select: Component<Props<string|number>> = (props) => {
    return(
        <>
            <div class="form-control max-w-16rem">
                <label class="label">
                    <span class="label-text">{props.title}</span>
                </label>
                <select name="theme" class="select select-sm select-bordered min-w-12rem" onChange={evt => props.onChange(evt)} value={props.selectedValue}>
                    <For each={props.itemArray}>{ (item) =>
                        <option value={item.id}>{item.name}</option>
                    }</For>
                </select>
            </div>
        </>
    )
}

export default Select;