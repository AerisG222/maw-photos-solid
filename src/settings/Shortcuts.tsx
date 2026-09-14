import { Component, For, Show } from "solid-js";

import { shortcutReference } from "../_models/ShortcutReference";

import Layout from "../_components/layout/Layout";
import Panel from "./components/Panel";
import PanelContainer from "./components/PanelContainer";
import Toolbar from "./components/Toolbar";

/*
   The keyboard, written down.

   `?` already answers "what can I press *here*" by listing what is registered
   on the current screen. It cannot answer "how does this work", because the
   screen you would be reading it on is the one screen whose shortcuts you are
   not asking about - and because the interesting part is the rule, not the
   list: digits follow the toolbar's order, so there is one thing to learn
   rather than a letter per screen.
*/
const ViewShortcuts: Component = () => {
    return (
        <Layout toolbar={<Toolbar />} title="Shortcuts">
            <PanelContainer>
                <For each={shortcutReference}>
                    {group => (
                        <Panel title={group.title}>
                            <Show when={group.detail}>
                                <p class="text-meta opacity-70 mb-3">{group.detail}</p>
                            </Show>

                            <dl class="grid grid-cols-[max-content_1fr] gap-x-3 gap-y-2 items-baseline">
                                <For each={group.entries}>
                                    {entry => (
                                        <>
                                            <dt class="whitespace-nowrap">
                                                <For each={entry.keys}>
                                                    {key => <kbd class="kbd kbd-sm">{key}</kbd>}
                                                </For>
                                            </dt>

                                            <dd class="min-w-0">
                                                <div>{entry.action}</div>
                                                <div class="text-meta opacity-60">
                                                    {entry.scope}
                                                </div>
                                            </dd>
                                        </>
                                    )}
                                </For>
                            </dl>
                        </Panel>
                    )}
                </For>
            </PanelContainer>
        </Layout>
    );
};

export default ViewShortcuts;
