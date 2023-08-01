import { Component, For, createEffect, createSignal } from "solid-js";

type Props = {
    editable: boolean;
    numberStars: number;
    value: number;
    clickHandler?: (rating: number) => void;
};

const Rating: Component<Props> = (props) => {
    const [stars, setStars] = createSignal([]);
    const [hoverStar, setHoverStar] = createSignal(0);

    const getClassList = (star: boolean) => {
        return {
            "cursor-pointer": props.editable,
            "i-ic-round-star": star,
            "i-ic-round-star-outline": !star,
        }
    };

    const handleClick = (rating: number) => {
        if(props.editable && props.clickHandler) {
            const ratingValue = rating === props.value ? -1 : rating;

            props.clickHandler(ratingValue);
        }
    };

    const getStarsArray = () => {
        var highlightedStars = hoverStar() > 0 ? hoverStar() : props.value;
        var stars = Array(props.numberStars);

        for(let i = 0; i < stars.length; i++) {
            stars[i] = highlightedStars > i
        }

        return stars;
    };

    createEffect(() => setStars(getStarsArray()));

    return (
        <div onMouseLeave={() => { if(props.editable) { setHoverStar(0) }} }>
            <For each={stars()}>{ (star, i) =>
                <span
                    class="text-6"
                    classList={getClassList(star)}
                    onClick={() => handleClick(i() + 1)}
                    onMouseEnter={() => {if(props.editable) { setHoverStar(i() + 1) }}}
                />
            }</For>
        </div>
    );
};

export default Rating;
