import { Component } from "solid-js";

const ViewApplication: Component = () => {
    return (
        <>
            <h1 class="head1">Release Notes</h1>

            <h3 class="head3"><span class="version">v3.0.0</span> : <span class="date">2023-08-??</span></h3>
            <p>
                Application re-write using <a href="https://www.solidjs.com/" class="text-primary">SOLID <strong>JS</strong></a>.
                The drivers for this effort include:
            </p>

            <ul class="list-inside list-disc mb-4">
                <li>Learning new/different technologies</li>
                <li>UX and DX performance improvements</li>
                <li>Switch to JSX templating</li>
                <li>Adopt <a href="https://unocss.dev/" class="text-primary">UnoCSS</a> and <a href="https://daisyui.com/" class="text-primary">daisyUI</a> for styling</li>
                <li>Improved code sharing, in particular, adding functionality for videos</li>
            </ul>
        </>
    );
};

export default ViewApplication;
