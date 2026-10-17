import { Component, For } from "solid-js";

import { getAreas } from "../areas";

const ViewReleaseNotes: Component = () => {
    const areas = getAreas();
    return (
        <>
            <h1 class="head1">Help</h1>

            <For
                each={[
                    areas.categories,
                    areas.people,
                    areas.places,
                    areas.random,
                    areas.search,
                    areas.stats,
                    areas.about,
                    areas.settings
                ].map(area => area.display)}
            >
                {route => (
                    <div class="mb-4">
                        <p class="head3">
                            <span class={"text-lg align-bottom " + route.icon} /> - {route.name}
                        </p>
                        <p>{route.helpText}</p>
                    </div>
                )}
            </For>

            <div class="my-8">
                <h3 class="head3">Keyboard Shortcuts</h3>
                <p>
                    Throughout the app, toolbars and other controls can often be controlled via the
                    keyboard in addition to clicking the on screen buttons. To view the available
                    keyboard shortcuts for a given screen, just type '?'.
                </p>
            </div>
        </>
    );
};

export default ViewReleaseNotes;
