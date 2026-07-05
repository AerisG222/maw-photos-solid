import { For, JSX } from "solid-js";
import { KeyValuePair } from "../../_models/KeyValuePair";

interface Props<T> {
    title: string;
    groupName: string;
    itemArray: KeyValuePair<T>[];
    selectedValue: T;
    onChange: (value: T) => void;
}

// Generic Solid component: Solid's `Component<P>` type can't take a type
// parameter, so a generic function returning `JSX.Element` is the idiomatic
// way to keep `RadioGroup` a component while letting `onChange` carry `T`.
const RadioGroup = <T extends string | number>(props: Props<T>): JSX.Element => {
    return (
        <>
            <h3 class="head3">{props.title}</h3>
            <For each={props.itemArray}>
                {item => (
                    <div class="form-control">
                        <label class="label cursor-pointer justify-start">
                            <input
                                type="radio"
                                name={props.groupName}
                                value={item.id}
                                checked={item.id === props.selectedValue}
                                class="radio mr-3"
                                onChange={() => props.onChange(item.id)}
                            />
                            <span class="label-text">{item.name}</span>
                        </label>
                    </div>
                )}
            </For>
        </>
    );
};

export default RadioGroup;
