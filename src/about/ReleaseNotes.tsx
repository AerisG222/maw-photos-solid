import { Component } from "solid-js";

const ViewApplication: Component = () => {
    return (
        <>
            <h1 class="head1">Release Notes</h1>

            <h3 class="head3">
                <span class="version">v4.0.0</span> : <span class="date">2025-10-13</span>
            </h3>
            <p>Major rework of the application:</p>
            <ul class="list-inside list-disc mb-4">
                <li>Updates to support changes to the backend API</li>
                <li>Categories can now contain both photos and videos</li>
                <li>
                    All media re-encoded in avif and av1 for better quality and smaller file sizes
                </li>
                <li>Better support for loading appropriately sized media for screen resolution</li>
                <li>By special request: allow users to disable dimming images in grids/lists</li>
                <li>Add options to view or hide navigation and toolbar button names</li>
                <li>Migrated to Auth0 for authentication</li>
                <li>Increased security so only authorized users can access media files</li>
                <li>
                    Key dependency changes: migrated from unocss to tailwind, first use of Tanstack
                    Solid Query, and switched from pnpm to bun
                </li>
                <li>Replaced rating media with the ability to favorite media and categories</li>
                <li>Improved themes</li>
            </ul>

            <h3 class="head3">
                <span class="version">v3.0.2</span> : <span class="date">2023-10-11</span>
            </h3>
            <p>A handful of improvements:</p>
            <ul class="list-inside list-disc mb-4">
                <li>
                    Improve how the category filter is applied to the main category listing page
                </li>
                <li>
                    Update bulk edit tool to update categories once all media items have GPS data
                </li>
                <li>Draw histograms when media item was already loaded</li>
                <li>A number of minor styling improvements</li>
            </ul>

            <h3 class="head3">
                <span class="version">v3.0.1</span> : <span class="date">2023-08-26</span>
            </h3>
            <p>Fix an issue preventing some users from accessing photos.</p>

            <h3 class="head3 mt-3">
                <span class="version">v3.0.0</span> : <span class="date">2023-08-12</span>
            </h3>
            <p>
                Application re-write using{" "}
                <a href="https://www.solidjs.com/" class="text-primary">
                    SOLID <strong>JS</strong>
                </a>
                . The drivers for this effort include:
            </p>

            <ul class="list-inside list-disc mb-4">
                <li>Learning new/different technologies</li>
                <li>UX and DX performance improvements</li>
                <li>Switch to JSX templating</li>
                <li>
                    Adopt{" "}
                    <a href="https://unocss.dev/" class="text-primary">
                        UnoCSS
                    </a>{" "}
                    and{" "}
                    <a href="https://daisyui.com/" class="text-primary">
                        daisyUI
                    </a>{" "}
                    for styling
                </li>
                <li>Improved code sharing, in particular, adding functionality for videos</li>
            </ul>
        </>
    );
};

export default ViewApplication;
