import { Component, For, createSignal } from 'solid-js';

export type Props = {
    editable: boolean;
    numberStars: number;
    value: number;
    clickHandler?: (rating: number) => void;
};

const Rating: Component<Props> = (props) => {
    const [stars, setStars] = createSignal([]);

    const x = [];
    for(let i = 0; i < props.numberStars; i++) {
        x.push(false);
    }
    setStars(stars);

    const getClassList = (i: number) => {
        return {
            'cursor-pointer': props.editable,
            'i-ic-round-star': i < 3,
            'i-ic-round-star-outline': i >= 3,
        }
    }

    const handleClick = (rating: number) => {
        if(props.editable && props.clickHandler) {
            props.clickHandler(rating);
        }
    }

    return (
        <For each={x}>{ (star, i) =>
            <span
                class="text-6"
                classList={getClassList(i())}
                onClick={() => handleClick(i() + 1)}
            />
        }</For>
    );
}

export default Rating;
