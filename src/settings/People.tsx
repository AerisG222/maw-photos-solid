import { Component, batch } from "solid-js";

import { useFaceFeedSettingsContext } from "../_contexts/settings/FaceFeedSettingsContext";
import { useFeedCategoryViewSettingsContext } from "../_contexts/settings/FeedCategoryViewSettingsContext";
import { usePeopleGridViewSettingsContext } from "../_contexts/settings/PeopleGridViewSettingsContext";
import { allMargins } from "../_models/Margin";
import { allPersonSorts } from "../_models/PersonSort";
import {
    ThumbnailSizeDefault,
    ThumbnailSizeIdType,
    allThumbnailSizes
} from "../_models/ThumbnailSize";

import Panel from "./components/Panel";
import PanelContainer from "./components/PanelContainer";
import RadioGroup from "../_components/input/RadioGroup";
import Toolbar from "./components/Toolbar";
import Toggle from "../_components/input/Toggle";
import Layout from "../_components/layout/Layout";

const ViewPeople: Component = () => {
    const [
        gridSettings,
        {
            setShowNames,
            setShowMediaCounts,
            setMargin,
            setThumbnailSize,
            setDimThumbnails,
            setSortBy
        }
    ] = usePeopleGridViewSettingsContext();
    const [feedSettings, { setFavoritesOnly, setShuffle, setShowCategories }] =
        useFaceFeedSettingsContext();
    const [
        categorySettings,
        {
            setShowTitles: setCategoryShowTitles,
            setShowYears: setCategoryShowYears,
            setMargin: setCategoryMargin,
            setThumbnailSize: setCategoryThumbnailSize,
            setDimThumbnails: setCategoryDimThumbnails,
            setShowFavoritesBadge: setCategoryShowFavoritesBadge,
            setShowTypesBadge: setCategoryShowTypesBadge
        }
    ] = useFeedCategoryViewSettingsContext();

    /*
       A card only has room for its title and year at the full thumbnail size, so
       the two settings hold each other in check - the same pairing the search
       results make.
    */
    const categorySetShowTitles = (doShow: boolean) => {
        batch(() => {
            setCategoryShowTitles(doShow);

            if (doShow) {
                setCategoryThumbnailSize(ThumbnailSizeDefault);
            }
        });
    };

    const categorySetShowYears = (doShow: boolean) => {
        batch(() => {
            setCategoryShowYears(doShow);

            if (doShow) {
                setCategoryThumbnailSize(ThumbnailSizeDefault);
            }
        });
    };

    const categorySetThumbnailSize = (thumbnailSize: ThumbnailSizeIdType) => {
        batch(() => {
            setCategoryThumbnailSize(thumbnailSize);

            if (thumbnailSize !== ThumbnailSizeDefault) {
                setCategoryShowTitles(false);
                setCategoryShowYears(false);
            }
        });
    };

    return (
        <Layout toolbar={<Toolbar />} title="People">
            <PanelContainer>
                <Panel title="Grid View">
                    <RadioGroup
                        title="Sort By"
                        groupName="gridSortBy"
                        itemArray={allPersonSorts}
                        selectedValue={gridSettings.sortBy}
                        onChange={setSortBy}
                    />
                    <Toggle
                        title="Show Names"
                        name="gridShowNames"
                        isSelected={gridSettings.showNames}
                        onChange={setShowNames}
                    />
                    <Toggle
                        title="Show Media Counts"
                        name="gridShowMediaCounts"
                        isSelected={gridSettings.showMediaCounts}
                        onChange={setShowMediaCounts}
                    />
                    <RadioGroup
                        title="Margins"
                        groupName="gridMargins"
                        itemArray={allMargins}
                        selectedValue={gridSettings.margin}
                        onChange={setMargin}
                    />
                    <RadioGroup
                        title="Thumbnail Size"
                        groupName="gridThumbnails"
                        itemArray={allThumbnailSizes}
                        selectedValue={gridSettings.thumbnailSize}
                        onChange={setThumbnailSize}
                    />
                    <Toggle
                        title="Dim Thumbnails"
                        name="gridDimThumbnails"
                        isSelected={gridSettings.dimThumbnails}
                        onChange={setDimThumbnails}
                    />
                </Panel>

                {/*
                    Defaults rather than live state: a feed carries its own filter
                    in the address so a link keeps working, and these decide what
                    that address says when it is opened without one.
                */}
                <Panel title="Person & Clan Media">
                    <Toggle
                        title="Show Favorites Only"
                        name="feedFavoritesOnly"
                        isSelected={feedSettings.favoritesOnly}
                        onChange={setFavoritesOnly}
                    />
                    <Toggle
                        title="Shuffle Media"
                        name="feedShuffle"
                        isSelected={feedSettings.shuffle}
                        onChange={setShuffle}
                    />
                    <Toggle
                        title="Open on Categories"
                        name="feedShowCategories"
                        isSelected={feedSettings.showCategories}
                        onChange={setShowCategories}
                    />
                </Panel>

                <Panel title="Person & Clan Categories">
                    <Toggle
                        title="Show Category Titles"
                        name="feedCategoryShowTitles"
                        isSelected={categorySettings.showTitles}
                        onChange={categorySetShowTitles}
                    />
                    <Toggle
                        title="Show Category Years"
                        name="feedCategoryShowYears"
                        isSelected={categorySettings.showYears}
                        onChange={categorySetShowYears}
                    />
                    <RadioGroup
                        title="Margins"
                        groupName="feedCategoryMargins"
                        itemArray={allMargins}
                        selectedValue={categorySettings.margin}
                        onChange={setCategoryMargin}
                    />
                    <RadioGroup
                        title="Thumbnail Size"
                        groupName="feedCategoryThumbnails"
                        itemArray={allThumbnailSizes}
                        selectedValue={categorySettings.thumbnailSize}
                        onChange={categorySetThumbnailSize}
                    />
                    <Toggle
                        title="Dim Thumbnails"
                        name="feedCategoryDimThumbnails"
                        isSelected={categorySettings.dimThumbnails}
                        onChange={setCategoryDimThumbnails}
                    />
                    <Toggle
                        title="Show Favorite Badges"
                        name="feedCategoryShowFavoriteBadges"
                        isSelected={categorySettings.showFavoritesBadge}
                        onChange={setCategoryShowFavoritesBadge}
                    />
                    <Toggle
                        title="Show Media Type Badges"
                        name="feedCategoryShowTypeBadges"
                        isSelected={categorySettings.showTypesBadge}
                        onChange={setCategoryShowTypesBadge}
                    />
                </Panel>
            </PanelContainer>
        </Layout>
    );
};

export default ViewPeople;
