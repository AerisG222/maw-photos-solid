import { Component, For, Show } from "solid-js";

import { usePhotoInfoPanelSettingsContext } from "../../contexts/settings/PhotoInfoPanelSettingsContext";

import Divider from "../../components/layout/Divider";
import SidebarLayout from "../../components/sidebar/SidebarLayout";
import ToolbarButton from "../../components/toolbar/ToolbarButton";
import RatingsCard from './RatingsCard';
import CommentsCard from './CommentsCard';
import HistogramCard from './HistogramCard';
import ExifCard from './ExifCard';
import EffectsCard from './EffectsCard';
import MinimapCard from './MinimapCard';
import MetadataEditorCard from './MetadataEditorCard';
import CategoryTeaserCard from './CategoryTeaserCard';
import InfoCard from './InfoCard';

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
            icon: "i-ic-round-star",
            clickHandler: toggleRatings,
            active: () => settings.expandInfoPanel && settings.showRatings,
            component: <RatingsCard />
        },
        {
            title: "Comments",
            icon: "i-ic-round-comment",
            clickHandler: toggleComments,
            active: () => settings.expandInfoPanel && settings.showComments,
            component: <CommentsCard />
        },
        {
            title: "EXIF Data",
            icon: "i-ic-round-tune",
            clickHandler: toggleExif,
            active: () => settings.expandInfoPanel && settings.showExif,
            component: <ExifCard />
        },
        {
            title: "Effects",
            icon: "i-ic-round-photo-filter",
            clickHandler: toggleEffects,
            active: () => settings.expandInfoPanel && settings.showEffects,
            component: <EffectsCard />
        },
        {
            title: "Histogram",
            icon: "i-ic-round-color-lens",
            clickHandler: toggleHistogram,
            active: () => settings.expandInfoPanel && settings.showHistogram,
            component: <HistogramCard />
        },
        {
            title: "MiniMap",
            icon: "i-ic-round-map",
            clickHandler: toggleMinimap,
            active: () => settings.expandInfoPanel && settings.showMinimap,
            component: <MinimapCard />
        },
        {
            title: "Metadata Editor",
            icon: "i-ic-round-edit",
            clickHandler: toggleMetadataEditor,
            active: () => settings.expandInfoPanel && settings.showMetadataEditor,
            component: <MetadataEditorCard />
        },
        {
            title: "Category Teaser Chooser",
            icon: "i-ic-round-image-search",
            clickHandler: toggleCategoryTeaserChooser,
            active: () => settings.expandInfoPanel && settings.showCategoryTeaserChooser,
            component: <CategoryTeaserCard />
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
                    name="Expand / Collapse"
                    icon={
                        settings.expandInfoPanel
                            ? "i-ic-chevron-right"
                            : "i-ic-chevron-left"
                    }
                    clickHandler={toggleExpandedState}
                />

                <Divider />

                <For each={cards}>{ card =>
                    <ToolbarButton
                        name={card.title}
                        icon={card.icon}
                        clickHandler={card.clickHandler}
                        active={card.active()}
                    />
                }</For>
            </SidebarLayout>
        </div>
    );
};

export default Sidebar;
