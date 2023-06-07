import { Component, Show } from 'solid-js';

export type Props = {
    enabled: boolean;
    handleClick: () => void;
}

const EffectsResetButton: Component<Props> = (props) => {
    return (
        <Show when={props.enabled}>
            <span class="ml-2 cursor-pointer i-ic-baseline-remove-circle" onClick={() => props.handleClick()}/>
        </Show>
    );
}

export default EffectsResetButton;
