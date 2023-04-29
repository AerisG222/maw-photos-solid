import { Component, Show } from "solid-js";
import Divider from "../../components/layout/Divider";
import SidebarLayout from "../../components/sidebar/SidebarLayout";
import ToolbarButton from "../../components/toolbar/ToolbarButton";
import { usePhotoInfoPanelSettingsContext } from "../../contexts/PhotoInfoPanelSettingsContext";

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

    return (
        <div class="flex">
            <Show when={settings.expandInfoPanel}>
                <div class="w-[500px] bg-secondary-content:6 border-l-1 border-l-secondary-content:10%">
                    <Show when={settings.expandInfoPanel && settings.showRatings}>
                        <div>ratings</div>
                    </Show>

                    <Show when={settings.expandInfoPanel && settings.showComments}>
                        <div>comments</div>
                    </Show>

                    <Show when={settings.expandInfoPanel && settings.showExif}>
                        <div>exif</div>
                    </Show>

                    <Show when={settings.expandInfoPanel && settings.showEffects}>
                        <div>effects</div>
                    </Show>

                    <Show when={settings.expandInfoPanel && settings.showHistogram}>
                        <div>histogram</div>
                    </Show>

                    <Show when={settings.expandInfoPanel && settings.showMinimap}>
                        <div>minimap</div>
                    </Show>

                    <Show when={settings.expandInfoPanel && settings.showMetadataEditor}>
                        <div>metadata</div>
                    </Show>

                    <Show when={settings.expandInfoPanel && settings.showCategoryTeaserChooser}>
                        <div>category teaser</div>
                    </Show>
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

                <ToolbarButton
                    name="Ratings"
                    icon="i-ic-round-star"
                    clickHandler={toggleRatings}
                    active={settings.expandInfoPanel && settings.showRatings}
                />
                <ToolbarButton
                    name="Comments"
                    icon="i-ic-round-comment"
                    clickHandler={toggleComments}
                    active={settings.expandInfoPanel && settings.showComments}
                />
                <ToolbarButton
                    name="EXIF Data"
                    icon="i-ic-round-tune"
                    clickHandler={toggleExif}
                    active={settings.expandInfoPanel && settings.showExif}
                />
                <ToolbarButton
                    name="Effects"
                    icon="i-ic-round-photo-filter"
                    clickHandler={toggleEffects}
                    active={settings.expandInfoPanel && settings.showEffects}
                />
                <ToolbarButton
                    name="Histogram"
                    icon="i-ic-round-color-lens"
                    clickHandler={toggleHistogram}
                    active={settings.expandInfoPanel && settings.showHistogram}
                />
                <ToolbarButton
                    name="MiniMap"
                    icon="i-ic-round-map"
                    clickHandler={toggleMinimap}
                    active={settings.expandInfoPanel && settings.showMinimap}
                />
                <ToolbarButton
                    name="Metadata Editor"
                    icon="i-ic-round-edit"
                    clickHandler={toggleMetadataEditor}
                    active={settings.expandInfoPanel && settings.showMetadataEditor}
                />
                <ToolbarButton
                    name="Category Teaser Chooser"
                    icon="i-ic-round-image-search"
                    clickHandler={toggleCategoryTeaserChooser}
                    active={settings.expandInfoPanel && settings.showCategoryTeaserChooser}
                />
            </SidebarLayout>
        </div>
    );
};

export default Sidebar;
