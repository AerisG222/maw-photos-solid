import { Component, For, createSignal } from 'solid-js';

export type Props = {
    editable: boolean;
    numberStars: number;
    value: number;
    clickHandler?: (rating: number) => void;
};

const Rating: Component<Props> = (props) => {
    const [hoverStar, setHoverStar] = createSignal(0);

    const getClassList = (star: boolean) => {
        return {
            'cursor-pointer': props.editable,
            'i-ic-round-star': star,
            'i-ic-round-star-outline': !star,
        }
    }

    const handleClick = (rating: number) => {
        if(props.editable && props.clickHandler) {
            const ratingValue = rating === props.value ? -1 : rating;

            props.clickHandler(ratingValue);
        }
    }

    const getStars = () => {
        const stars = [];

        for(let i = 0; i < props.numberStars; i++) {
            if(hoverStar() > 0) {
                stars.push(hoverStar() > i)
            } else {
                stars.push(props.value > i)
            }
        }

        return stars;
    }

    return (
        <div onMouseLeave={() => { if(props.editable) { setHoverStar(0) }} }>
            <For each={getStars()}>{ (star, i) =>
                <span
                    class="text-6"
                    classList={getClassList(star)}
                    onClick={() => handleClick(i() + 1)}
                    onMouseEnter={() => {if(props.editable) { setHoverStar(i() + 1) }}}
                />
            }</For>
        </div>
    );
}

export default Rating;
