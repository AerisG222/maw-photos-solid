import { Route, Routes } from '@solidjs/router';
import type { Component } from "solid-js";

import About from './pages/About';
import Home from './pages/Home';

const App: Component = () => {
    return <>
        <p class="text-4xl text-green-700 text-center py-20">
            Hello{" "}
            <a
                class="text-pink-600 hover:font-bold hover:border-1"
                href="https://antfu.me/posts/reimagine-atomic-css"
                target="atomic-css"
            >
                Atomic CSS
            </a>
            !
        </p>
        <Routes>
            <Route path="/about" component={About} />
            <Route path="/" component={Home} />
        </Routes>
    </>
};

export default App;
