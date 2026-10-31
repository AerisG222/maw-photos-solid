import { Component } from "solid-js";

interface Props {
    title: string;
    name: string;
    isSelected: boolean;
    onChange: (isSelected: boolean) => void;
}

// labelled beside the switch, as a checkbox is - and so named by its label
const Toggle: Component<Props> = props => {
    return (
        <div class="form-control">
            <label class="label cursor-pointer justify-start">
                <input
                    type="checkbox"
                    class="toggle mr-3"
                    name={props.name}
                    checked={props.isSelected}
                    onChange={evt => props.onChange(evt.currentTarget.checked)}
                />
                <span class="label-text">{props.title}</span>
            </label>
        </div>
    );
};

export default Toggle;
