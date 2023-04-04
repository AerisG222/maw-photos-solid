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
            <div class="form-control">
                <label class="label cursor-pointer justify-start">
                    <input type="checkbox" checked={props.isSelected} class="checkbox mr-3" onChange={evt => props.onChange(evt)} />
                    <span class="label-text">{props.title}</span>
                </label>
            </div>
        </>
    )
}

export default Select;