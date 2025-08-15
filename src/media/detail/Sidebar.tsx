import { Component, For, Show, lazy } from "solid-js";

import { useMediaInfoPanelSettingsContext } from "../../_contexts/settings/MediaInfoPanelSettingsContext";
import { Media } from "../../_models/Media";
import { useMediaListContext } from "../contexts/MediaListContext";
import { useRouteDetailContext } from "../../_contexts/RouteDetailContext";

import ToolbarDivider from "../../_components/toolbar/ToolbarDivider";
import SidebarLayout from "../../_components/sidebar/SidebarLayout";
import InfoCard from "../../_components/sidebar/InfoCard";
import ToolbarButton from "../../_components/toolbar/ToolbarButton";
import { AreaRandom } from "../../_models/AppRouteDefinition";

const Sidebar: Component = () => {
    const [routeContext] = useRouteDetailContext();

    const [
        settings,
        {
            setExpandInfoPanel,
            setShowRatings,
            setShowComments,
            setShowExif,
            setShowEffects,
            setShowHistogram,
            setShowMinimap,
            setShowMetadataEditor,
            setShowCategoryTeaserChooser
        }
    ] = useMediaInfoPanelSettingsContext();

    const [mediaList] = useMediaListContext();

    const toggleExpandedState = () => {
        setExpandInfoPanel(!settings.expandInfoPanel);
    };

    const toggleRatings = () => {
        setShowRatings(!settings.showRatings);
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

    const toggleCategoryTeaserChooser = () => {
        setShowCategoryTeaserChooser(!settings.showCategoryTeaserChooser);
    };

    const cards = [
        {
            title: "Ratings",
            tooltip: "Sidebar: Ratings",
            icon: "icon-[ic--round-star]",
            shortcutKeys: ["r"],
            clickHandler: toggleRatings,
            enable: (media: Media) => true,
            active: () => settings.expandInfoPanel && settings.showRatings,
            component: lazy(() => import("./RatingsCard"))
        },
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
            shortcutKeys: ["h"],
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
            title: "Category Teaser Chooser",
            tooltip: "Sidebar: Category Teaser Chooser",
            icon: "icon-[ic--round-image-search]",
            shortcutKeys: ["k"],
            clickHandler: toggleCategoryTeaserChooser,
            enable: (media: Media) => routeContext.area !== AreaRandom,
            active: () => settings.expandInfoPanel && settings.showCategoryTeaserChooser,
            component: lazy(() => import("./CategoryTeaserCard"))
        }
    ];

    return (
        <div class="flex">
            <Show when={settings.expandInfoPanel}>
                <div class="w-[500px] bg-base-200 border-l-1 border-l-base-content:30% overflow-y-auto overflow-x-hidden scrollable">
                    <For each={cards.filter(card => card.enable(mediaList.activeItem))}>
                        {card => (
                            <Show when={card.active()}>
                                <InfoCard title={card.title} icon={card.icon}>
                                    {card.component}
                                </InfoCard>
                            </Show>
                        )}
                    </For>
                </div>
            </Show>

            <SidebarLayout>
                <ToolbarButton
                    name="Sidebar: Expand / Collapse"
                    icon={
                        settings.expandInfoPanel
                            ? "icon-[ic--chevron-right]"
                            : "icon-[ic--chevron-left]"
                    }
                    shortcutKeys={["i"]}
                    clickHandler={toggleExpandedState}
                />

                <ToolbarDivider />

                <For each={cards.filter(card => card.enable(mediaList.activeItem))}>
                    {card => (
                        <ToolbarButton
                            disabled={!settings.expandInfoPanel}
                            name={card.tooltip}
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
