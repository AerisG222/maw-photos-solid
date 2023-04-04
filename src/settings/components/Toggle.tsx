import { Component } from 'solid-js'

export type Props = {
    title: string,
    name: string,
    isSelected: boolean,
    onChange: (evt: Event) => void
};

const Select: Component<Props> = (props) => {
    return(
        <>
            <h3>{props.title}</h3>
            <div class="form-control">
                <label class="label cursor-pointer justify-start">
                    <input type="checkbox" class="toggle mr-3" name={props.name} checked={props.isSelected} onChange={evt => props.onChange(evt)} />
                </label>
            </div>
        </>
    )
}

export default Select;
