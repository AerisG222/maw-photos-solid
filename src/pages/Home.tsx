import { Component } from "solid-js";

import HomeToolbar from '../components/HomeToolbar';

const Home: Component = () => {
    return (
        <div class="grid
                    grid-rows-[max-content_auto] grid-cols-[100vw]
                    md:grid-rows-[100vh] md:grid-cols-[max-content_auto]">
            <HomeToolbar />
            <h1>Home</h1>
        </div>
    );
};

export default Home;
