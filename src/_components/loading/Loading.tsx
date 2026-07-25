import { Component } from "solid-js";

const Loading: Component = () => {
    return (
        <div class="my-8 flex justify-center">
            <span class="loading loading-dots loading-md text-primary" />
        </div>
    );
};

export default Loading;
