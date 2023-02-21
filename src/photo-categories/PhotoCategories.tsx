import { Component } from "solid-js";

import Toolbar from "./Toolbar";

const PhotoCategories: Component = () => {
    return (
        <div
            class="grid
                    grid-rows-[max-content_auto] grid-cols-[100vw]
                    md:grid-rows-[100vh] md:grid-cols-[max-content_auto]"
        >
            <Toolbar />
            <div>
                <h1>Photo Categories</h1>
            </div>
        </div>
    );
};

export default PhotoCategories;
