import { Component } from "solid-js";

const ViewApplication: Component = () => {
    return (
        <>
            <h1 class="head1">Release Notes</h1>

            <h3 class="head3">
                <span class="version">v4.4.0</span> : <span class="date">2026-08-28</span>
            </h3>
            <p>Additional improvements to the people section</p>
            <ul class="list-inside list-disc mb-4">
                <li>Add ability to view categories for a person or clan, not just their media</li>
                <li>Improve toolbar layout in the people area so most important actions appear first</li>
                <li>Improved consistency when requesting more media as there is now a dedicated toolbar button to load more, rather than a button at the bottom of some screens</li>
                <li>Other minor tweaks and improvements</li>
            </ul>

            <h3 class="head3">
                <span class="version">v4.3.0</span> : <span class="date">2026-08-23</span>
            </h3>
            <p>Major update: Add new section to browse media by individuals</p>
            <ul class="list-inside list-disc mb-4">
                <li>Choose a person and view media they are in</li>
                <li>Favorite the people you look for most to keep them at the top of the list</li>
                <li>Build a clan, like "the kids", and browse media that contains any of them</li>
                <li>
                    Randomize photos for selected people or clans, or filter to just include media
                    you marked as favorites
                </li>
                <li>Show names of known people with a border around their face</li>
                <li>Several other UI improvements and fixes</li>
                <li>Numerous dependency updates</li>
            </ul>

            <h3 class="head3">
                <span class="version">v4.2.0</span> : <span class="date">2026-07-25</span>
            </h3>
            <p>Set Claude loose for more improvements:</p>
            <ul class="list-inside list-disc mb-4">
                <li>Add some animation and other UI polish</li>
                <li>Improve error messaging under more situations</li>
                <li>Update to support api versioning on the backend</li>
                <li>Further optimize production build</li>
                <li>Improve use of Tanstack Query</li>
                <li>Update dependencies</li>
            </ul>

            <h3 class="head3">
                <span class="version">v4.1.0</span> : <span class="date">2026-07-06</span>
            </h3>
            <p>Set Claude loose on my podunk codebase:</p>
            <ul class="list-inside list-disc mb-4">
                <li>
                    Make the service worker more efficient by caching access token and coalescing
                    concurrent requests
                </li>
                <li>Cleanup html/css grid layout to improve composability</li>
                <li>Improve typings and fix most lint issues</li>
                <li>
                    Improve stats to reuse the treemap chart rather than rebuilding it when filters
                    change
                </li>
                <li>Do less work when building histograms</li>
                <li>Use gmp-click rather than standard click in google maps for markers</li>
                <li>Fix the close icon in google maps</li>
                <li>Improve font loading performance by loading in html</li>
                <li>Update dependencies</li>
            </ul>

            <h3 class="head3">
                <span class="version">v4.0.2</span> : <span class="date">2026-03-21</span>
            </h3>
            <p>Minor enhancements:</p>
            <ul class="list-inside list-disc mb-4">
                <li>Add option to show media types in category and media itself</li>
                <li>
                    Toolbar buttons that toggle behavior now set a background color to reinforce
                    when they are active
                </li>
                <li>Update dependencies</li>
            </ul>

            <h3 class="head3">
                <span class="version">v4.0.1</span> : <span class="date">2025-11-15</span>
            </h3>
            <p>Minor update:</p>
            <ul class="list-inside list-disc mb-4">
                <li>Fix issues with downloading categories and media</li>
            </ul>

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
