import { Component, For, Show, lazy } from "solid-js";

import { usePhotoInfoPanelSettingsContext } from "../../../contexts/settings/PhotoInfoPanelSettingsContext";

import Divider from "../../layout/Divider";
import SidebarLayout from "../../sidebar/SidebarLayout";
import ToolbarButton from "../../toolbar/ToolbarButton";
import InfoCard from '../../sidebar/InfoCard';

const Sidebar: Component = () => {
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
            setShowCategoryTeaserChooser,
        },
    ] = usePhotoInfoPanelSettingsContext();

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
            tooltip: "Ratings (R)",
            icon: "i-ic-round-star",
            shortcutKeys: ['r'],
            clickHandler: toggleRatings,
            active: () => settings.expandInfoPanel && settings.showRatings,
            component: lazy(() => import('./RatingsCard'))
        },
        {
            title: "Comments",
            tooltip: "Comments (C)",
            icon: "i-ic-round-comment",
            shortcutKeys: ['c'],
            clickHandler: toggleComments,
            active: () => settings.expandInfoPanel && settings.showComments,
            component: lazy(() => import('./CommentsCard'))
        },
        {
            title: "EXIF Data",
            tooltip: "EXIF Data (X)",
            icon: "i-ic-round-tune",
            shortcutKeys: ['x'],
            clickHandler: toggleExif,
            active: () => settings.expandInfoPanel && settings.showExif,
            component: lazy(() => import('./ExifCard'))
        },
        {
            title: "Effects",
            tooltip: "Effects (E)",
            icon: "i-ic-round-photo-filter",
            shortcutKeys: ['e'],
            clickHandler: toggleEffects,
            active: () => settings.expandInfoPanel && settings.showEffects,
            component: lazy(() => import('./EffectsCard'))
        },
        {
            title: "Histogram",
            tooltip: "Histogram (H)",
            icon: "i-ic-round-color-lens",
            shortcutKeys: ['h'],
            clickHandler: toggleHistogram,
            active: () => settings.expandInfoPanel && settings.showHistogram,
            component: lazy(() => import('./HistogramCard'))
        },
        {
            title: "MiniMap",
            tooltip: "MiniMap (V)",
            icon: "i-ic-round-map",
            shortcutKeys: ['v'],
            clickHandler: toggleMinimap,
            active: () => settings.expandInfoPanel && settings.showMinimap,
            component: lazy(() => import('./MinimapCard'))
        },
        {
            title: "Metadata Editor",
            tooltip: "Metadata Editor (N)",
            icon: "i-ic-round-edit",
            shortcutKeys: ['n'],
            clickHandler: toggleMetadataEditor,
            active: () => settings.expandInfoPanel && settings.showMetadataEditor,
            component: lazy(() => import('./MetadataEditorCard'))
        },
        {
            title: "Category Teaser Chooser",
            tooltip: "Category Teaser Chooser (K)",
            icon: "i-ic-round-image-search",
            shortcutKeys: ['k'],
            clickHandler: toggleCategoryTeaserChooser,
            active: () => settings.expandInfoPanel && settings.showCategoryTeaserChooser,
            component: lazy(() => import('./CategoryTeaserCard'))
        }
    ];

    return (
        <div class="flex">
            <Show when={settings.expandInfoPanel}>
                <div class="w-[500px] bg-secondary-content:6 border-l-1 border-l-secondary-content:10% overflow-y-auto overflow-x-hidden">
                    <For each={cards}>{ card =>
                        <Show when={card.active()}>
                            <InfoCard title={card.title} icon={card.icon}>
                                {card.component}
                            </InfoCard>
                        </Show>
                    }</For>
                </div>
            </Show>

            <SidebarLayout>
                <ToolbarButton
                    name="Expand / Collapse (I)"
                    icon={
                        settings.expandInfoPanel
                            ? "i-ic-chevron-right"
                            : "i-ic-chevron-left"
                    }
                    shortcutKeys={['i']}
                    clickHandler={toggleExpandedState}
                />

                <Divider />

                <For each={cards}>{ card =>
                    <ToolbarButton
                        name={card.tooltip}
                        icon={card.icon}
                        shortcutKeys={card.shortcutKeys}
                        clickHandler={card.clickHandler}
                        active={card.active()}
                    />
                }</For>
            </SidebarLayout>
        </div>
    );
};

export default Sidebar;
