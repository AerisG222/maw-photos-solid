import { Component } from "solid-js";

interface Props {
    continueSearch: () => void;
}

const SearchMoreButton: Component<Props> = props => {
    return (
        <div class="flex justify-center my-3">
            <button class="btn btn-primary btn-outline" onClick={() => props.continueSearch()}>
                <span class="text-lg icon-[ic--round-keyboard-arrow-down]" /> Show More
            </button>
        </div>
    );
};

export default SearchMoreButton;
