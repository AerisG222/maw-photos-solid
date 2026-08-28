import { ParentComponent } from "solid-js";

import { AppSettingsProvider } from "./AppSettingsContext";
import { CategoryFilterSettingsProvider } from "./CategoryFilterSettingsContext";
import { CategoryGridSettingsProvider } from "./CategoryGridViewSettingsContext";
import { CategoryListSettingsProvider } from "./CategoryListViewSettingsContext";
import { CategoryPageSettingsProvider } from "./CategoryPageSettingsContext";
import { FaceFeedSettingsProvider } from "./FaceFeedSettingsContext";
import { FeedCategorySettingsProvider } from "./FeedCategoryViewSettingsContext";
import { MediaDetailSettingsProvider } from "./MediaDetailViewSettingsContext";
import { MediaGridSettingsProvider } from "./MediaGridViewSettingsContext";
import { MediaInfoPanelSettingsProvider } from "./MediaInfoPanelSettingsContext";
import { MediaMapSettingsProvider } from "./MediaMapViewSettingsContext";
import { MediaPageSettingsProvider } from "./MediaPageSettingsContext";
import { PeopleGridSettingsProvider } from "./PeopleGridViewSettingsContext";
import { SearchGridSettingsProvider } from "./SearchGridViewSettingsContext";
import { SearchListSettingsProvider } from "./SearchListViewSettingsContext";
import { SearchPageSettingsProvider } from "./SearchPageSettingsContext";
import { MediaFullscreenSettingsProvider } from "./MediaFullscreenViewSettingsContext";

export const AllSettingsProvider: ParentComponent = props => {
    return (
        <AppSettingsProvider>
            <CategoryFilterSettingsProvider>
                <CategoryGridSettingsProvider>
                    <CategoryListSettingsProvider>
                        <CategoryPageSettingsProvider>
                            <FaceFeedSettingsProvider>
                                <FeedCategorySettingsProvider>
                                    <MediaDetailSettingsProvider>
                                        <MediaFullscreenSettingsProvider>
                                            <MediaGridSettingsProvider>
                                                <MediaInfoPanelSettingsProvider>
                                                    <MediaMapSettingsProvider>
                                                        <MediaPageSettingsProvider>
                                                            <PeopleGridSettingsProvider>
                                                                <SearchGridSettingsProvider>
                                                                    <SearchListSettingsProvider>
                                                                        <SearchPageSettingsProvider>
                                                                            {props.children}
                                                                        </SearchPageSettingsProvider>
                                                                    </SearchListSettingsProvider>
                                                                </SearchGridSettingsProvider>
                                                            </PeopleGridSettingsProvider>
                                                        </MediaPageSettingsProvider>
                                                    </MediaMapSettingsProvider>
                                                </MediaInfoPanelSettingsProvider>
                                            </MediaGridSettingsProvider>
                                        </MediaFullscreenSettingsProvider>
                                    </MediaDetailSettingsProvider>
                                </FeedCategorySettingsProvider>
                            </FaceFeedSettingsProvider>
                        </CategoryPageSettingsProvider>
                    </CategoryListSettingsProvider>
                </CategoryGridSettingsProvider>
            </CategoryFilterSettingsProvider>
        </AppSettingsProvider>
    );
};
