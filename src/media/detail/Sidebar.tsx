import { Component, For, Show, lazy } from "solid-js";

import { usePhotoInfoPanelSettingsContext } from "../../contexts/settings/PhotoInfoPanelSettingsContext";
import { Media, MediaTypePhoto } from '../../_models/Media';
import { useMediaListContext } from '../contexts/MediaListContext';
import { useRouteDetailContext } from '../../contexts/RouteDetailContext';

import Divider from "../../components/layout/Divider";
import SidebarLayout from "../../components/sidebar/SidebarLayout";
import InfoCard from '../../components/sidebar/InfoCard';
import ToolbarButton from "../../components/toolbar/ToolbarButton";
import { AreaRandom } from '../../_models/AppRouteDefinition';

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
            setShowCategoryTeaserChooser,
        },
    ] = usePhotoInfoPanelSettingsContext();

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
            tooltip: "Ratings (R)",
            icon: "i-ic-round-star",
            shortcutKeys: ['r'],
            clickHandler: toggleRatings,
            enable: (media: Media) => true,
            active: () => settings.expandInfoPanel && settings.showRatings,
            component: lazy(() => import('./RatingsCard'))
        },
        {
            title: "Comments",
            tooltip: "Comments (C)",
            icon: "i-ic-round-comment",
            shortcutKeys: ['c'],
            clickHandler: toggleComments,
            enable: (media: Media) => true,
            active: () => settings.expandInfoPanel && settings.showComments,
            component: lazy(() => import('./CommentsCard'))
        },
        {
            title: "EXIF Data",
            tooltip: "EXIF Data (X)",
            icon: "i-ic-round-tune",
            shortcutKeys: ['x'],
            clickHandler: toggleExif,
            enable: (media: Media) => media?.kind === MediaTypePhoto,
            active: () => settings.expandInfoPanel && settings.showExif,
            component: lazy(() => import('./ExifCard'))
        },
        {
            title: "Effects",
            tooltip: "Effects (E)",
            icon: "i-ic-round-photo-filter",
            shortcutKeys: ['e'],
            clickHandler: toggleEffects,
            enable: (media: Media) => true,
            active: () => settings.expandInfoPanel && settings.showEffects,
            component: lazy(() => import('./EffectsCard'))
        },
        {
            title: "Histogram",
            tooltip: "Histogram (H)",
            icon: "i-ic-round-color-lens",
            shortcutKeys: ['h'],
            clickHandler: toggleHistogram,
            enable: (media: Media) => true,
            active: () => settings.expandInfoPanel && settings.showHistogram,
            component: lazy(() => import('./HistogramCard'))
        },
        {
            title: "MiniMap",
            tooltip: "MiniMap (V)",
            icon: "i-ic-round-map",
            shortcutKeys: ['v'],
            clickHandler: toggleMinimap,
            enable: (media: Media) => true,
            active: () => settings.expandInfoPanel && settings.showMinimap,
            component: lazy(() => import('./MinimapCard'))
        },
        {
            title: "Metadata Editor",
            tooltip: "Metadata Editor (N)",
            icon: "i-ic-round-edit",
            shortcutKeys: ['n'],
            clickHandler: toggleMetadataEditor,
            enable: (media: Media) => true,
            active: () => settings.expandInfoPanel && settings.showMetadataEditor,
            component: lazy(() => import('./MetadataEditorCard'))
        },
        {
            title: "Category Teaser Chooser",
            tooltip: "Category Teaser Chooser (K)",
            icon: "i-ic-round-image-search",
            shortcutKeys: ['k'],
            clickHandler: toggleCategoryTeaserChooser,
            enable: (media: Media) => routeContext.area !== AreaRandom,
            active: () => settings.expandInfoPanel && settings.showCategoryTeaserChooser,
            component: lazy(() => import('./CategoryTeaserCard'))
        }
    ];

    return (
        <div class="flex">
            <Show when={settings.expandInfoPanel}>
                <div class="w-[500px] bg-base-200 border-l-1 border-l-base-content:30% overflow-y-auto overflow-x-hidden">
                    <For each={cards.filter(card => card.enable(mediaList.activeItem))}>{ card =>
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

                <For each={cards.filter(card => card.enable(mediaList.activeItem))}>{ card =>
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
