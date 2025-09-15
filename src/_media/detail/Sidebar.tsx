import { Component, For, Show, lazy } from "solid-js";
import { Dynamic } from "solid-js/web";

import { useMediaInfoPanelSettingsContext } from "../../_contexts/settings/MediaInfoPanelSettingsContext";
import { Media } from "../../_models/Media";
import { Category } from "../../_models/Category";

import ToolbarDivider from "../../_components/toolbar/ToolbarDivider";
import SidebarLayout from "../../_components/sidebar/SidebarLayout";
import InfoCard from "../../_components/sidebar/InfoCard";
import SidebarButton from "../../_components/sidebar/SidebarButton";

interface Props {
    activeCategory: Category | undefined;
    activeMedia: Media | undefined;
    enableCategoryTeaser: boolean;
    mediaElement: HTMLImageElement | HTMLVideoElement | undefined;
}

const Sidebar: Component<Props> = props => {
    const [
        settings,
        {
            setExpandInfoPanel,
            setShowComments,
            setShowExif,
            setShowEffects,
            setShowHistogram,
            setShowMinimap,
            setShowMetadataEditor,
            setShowCategoryTeaserChooser
        }
    ] = useMediaInfoPanelSettingsContext();

    const toggleExpandedState = () => {
        setExpandInfoPanel(!settings.expandInfoPanel);
    };

    const toggleComments = () => {
        setShowComments(!settings.showComments);
    };

    const toggleExif = () => {
        setShowExif(!settings.showExif);
    };

    const toggleEffects = () => {
        setShowEffects(!settings.showEffects);
    };

    const toggleHistogram = () => {
        setShowHistogram(!settings.showHistogram);
    };

    const toggleMinimap = () => {
        setShowMinimap(!settings.showMinimap);
    };

    const toggleMetadataEditor = () => {
        setShowMetadataEditor(!settings.showMetadataEditor);
    };

    const toggleCategoryTeaser = () => {
        setShowCategoryTeaserChooser(!settings.showCategoryTeaserChooser);
    };

    const cards = [
        {
            title: "Comments",
            tooltip: "Sidebar: Comments",
            icon: "icon-[ic--round-comment]",
            shortcutKeys: ["c"],
            clickHandler: toggleComments,
            enable: (media: Media) => true,
            active: () => settings.expandInfoPanel && settings.showComments,
            component: lazy(() => import("./CommentsCard"))
        },
        {
            title: "EXIF Data",
            tooltip: "Sidebar: EXIF Data",
            icon: "icon-[ic--round-tune]",
            shortcutKeys: ["x"],
            clickHandler: toggleExif,
            enable: (media: Media) => true,
            active: () => settings.expandInfoPanel && settings.showExif,
            component: lazy(() => import("./ExifCard"))
        },
        {
            title: "Effects",
            tooltip: "Sidebar: Effects",
            icon: "icon-[ic--round-photo-filter]",
            shortcutKeys: ["e"],
            clickHandler: toggleEffects,
            enable: (media: Media) => true,
            active: () => settings.expandInfoPanel && settings.showEffects,
            component: lazy(() => import("./EffectsCard"))
        },
        {
            title: "Histogram",
            tooltip: "Sidebar: Histogram",
            icon: "icon-[ic--round-color-lens]",
            shortcutKeys: ["o"],
            clickHandler: toggleHistogram,
            enable: (media: Media) => true,
            active: () => settings.expandInfoPanel && settings.showHistogram,
            component: lazy(() => import("./HistogramCard"))
        },
        {
            title: "MiniMap",
            tooltip: "Sidebar: MiniMap",
            icon: "icon-[ic--round-map]",
            shortcutKeys: ["v"],
            clickHandler: toggleMinimap,
            enable: (media: Media) => true,
            active: () => settings.expandInfoPanel && settings.showMinimap,
            component: lazy(() => import("./MinimapCard"))
        },
        {
            title: "Metadata Editor",
            tooltip: "Sidebar: Metadata Editor",
            icon: "icon-[ic--round-edit]",
            shortcutKeys: ["n"],
            clickHandler: toggleMetadataEditor,
            enable: (media: Media) => true,
            active: () => settings.expandInfoPanel && settings.showMetadataEditor,
            component: lazy(() => import("./MetadataEditorCard"))
        },
        {
            title: "Category Teaser",
            tooltip: "Sidebar: Category Teaser",
            icon: "icon-[ic--round-image-search]",
            shortcutKeys: ["k"],
            clickHandler: toggleCategoryTeaser,
            enable: (media: Media) => props.enableCategoryTeaser,
            active: () => settings.expandInfoPanel && settings.showCategoryTeaserChooser,
            component: lazy(() => import("./CategoryTeaserCard"))
        }
    ];

    return (
        <div class="flex">
            <Show when={settings.expandInfoPanel}>
                <div class="w-[500px] bg-base-200 border-l-1 border-l-base-content/30 overflow-y-auto overflow-x-hidden scrollable">
                    <For each={cards.filter(card => card.enable(props.activeMedia!))}>
                        {card => (
                            <Show when={card.active()}>
                                <InfoCard title={card.title} icon={card.icon}>
                                    <Dynamic
                                        component={card.component}
                                        activeCategory={props.activeCategory}
                                        activeMedia={props.activeMedia}
                                        mediaElement={props.mediaElement}
                                    />
                                </InfoCard>
                            </Show>
                        )}
                    </For>
                </div>
            </Show>

            <SidebarLayout>
                <SidebarButton
                    name="Sidebar: Expand / Collapse"
                    tooltip="Sidebar: Expand / Collapse"
                    icon={
                        settings.expandInfoPanel
                            ? "icon-[ic--chevron-right]"
                            : "icon-[ic--chevron-left]"
                    }
                    shortcutKeys={["i"]}
                    clickHandler={toggleExpandedState}
                />

                <ToolbarDivider />

                <For each={cards.filter(card => card.enable(props.activeMedia!))}>
                    {card => (
                        <SidebarButton
                            disabled={!settings.expandInfoPanel}
                            name={card.tooltip}
                            tooltip={card.tooltip}
                            icon={card.icon}
                            shortcutKeys={card.shortcutKeys}
                            clickHandler={() =>
                                settings.expandInfoPanel ? card.clickHandler() : {}
                            }
                            active={card.active()}
                        />
                    )}
                </For>
            </SidebarLayout>
        </div>
    );
};

export default Sidebar;
