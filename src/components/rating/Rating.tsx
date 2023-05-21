import { Component, For, createSignal, onMount } from 'solid-js';

export type Props = {
    editable: boolean;
    numberStars: number;
    value: number;
    clickHandler?: (rating: number) => void;
};

const Rating: Component<Props> = (props) => {
    const [stars, setStars] = createSignal([]);

    const getClassList = (star: boolean) => {
        return {
            'cursor-pointer': props.editable,
            'i-ic-round-star': star,
            'i-ic-round-star-outline': !star,
        }
    }

    const handleClick = (rating: number) => {
        if(props.editable && props.clickHandler) {
            props.clickHandler(rating);
        }
    }

    const reset = () => showStars(props.value);

    const showStars = (val: number) => {
        const x = [];

        for(let i = 0; i < props.numberStars; i++) {
            x.push(val > i);
        }

        setStars(x);
    }

    const mouseEnter = (i) => {
        if(!props.editable) {
            return;
        }

        showStars(i);
    };

    onMount(() => reset());

    return (
        <div onMouseLeave={() => { if(props.editable) { reset(); }} }>
            <For each={stars()}>{ (star, i) =>
                <span
                    class="text-6"
                    classList={getClassList(star)}
                    onClick={() => handleClick(i() + 1)}
                    onMouseEnter={() => mouseEnter(i() + 1)}
                />
            }</For>
        </div>
    );
}

export default Rating;
