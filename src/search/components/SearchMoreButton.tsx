import { Component } from "solid-js";

type Props = {
    continueSearch: () => void;
};

const SearchMoreButton: Component<Props> = props => {
    return (
        <div class="flex justify-center my-3">
            <button class="btn btn-primary btn-outline" onClick={() => props.continueSearch()}>
                <span class="text-6 icon-[ic--round-keyboard-arrow-down]" /> Show More
            </button>
        </div>
    );
};

export default SearchMoreButton;
