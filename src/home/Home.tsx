import { Component } from "solid-js";

import Toolbar from "./Toolbar";

const Home: Component = () => {
    return (
        <div
            class="grid
                    grid-rows-[max-content_auto] grid-cols-[100vw]
                    md:grid-rows-[100vh] md:grid-cols-[max-content_auto]"
        >
            <Toolbar />
            <div>
                <h1>Home</h1>
                <p>Here is a variable: {import.meta.env.VITE_AUTH_CLIENT_ID}</p>
            </div>
        </div>
    );
};

export default Home;
