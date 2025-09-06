import { Component, createSignal, For, Show } from "solid-js";

import { Category } from "../../_models/Category";
import { Media } from "../../_models/Media";
import { useMediaContext } from "../../_contexts/api/MediaContext";

interface Props {
    activeCategory: Category | undefined;
    activeMedia: Media | undefined;
}

// TODO: consider adding reverse geocode info
const ExifCard: Component<Props> = props => {
    const { metadataQuery } = useMediaContext();
    const [currentTab, setCurrentTab] = createSignal("");
    const metadata = metadataQuery(() => props.activeMedia!.id);

    return (
        <>
            <Show when={metadata.data}>
                <div class="tabs tabs-border">
                    <For each={Object.keys(metadata.data!)}>
                        {(key, index) => {
                            if (index() === 0) {
                                setCurrentTab(key);
                            }

                            return (
                                <a
                                    class="tab"
                                    classList={{ "tab-active": currentTab() === key }}
                                    onClick={() => setCurrentTab(key)}
                                >
                                    {key}
                                </a>
                            );
                        }}
                    </For>

                    <span class="grow tab-border" />
                </div>

                <table class="table table-xs table-zebra w-full">
                    <tbody>
                        <For each={Object.entries(metadata.data![currentTab()])}>
                            {entry => (
                                <tr>
                                    <td>{entry[1].desc}</td>
                                    <td>{entry[1].val}</td>
                                </tr>
                            )}
                        </For>
                    </tbody>
                </table>
            </Show>
        </>
    );
};

export default ExifCard;
