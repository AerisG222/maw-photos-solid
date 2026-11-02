import { Component } from "solid-js";

import { useAreaSettingsContext } from "../_contexts/settings/AreaSettingsContext";
import { useListingSettingsContext } from "../_contexts/settings/ListingSettingsContext";
import { allCategoryViewModes } from "../_models/CategoryViewMode";

import CategoryFilterOptions from "../_components/filters/CategoryFilterOptions";
import Panel from "./components/Panel";
import PanelContainer from "./components/PanelContainer";
import RadioGroup from "../_components/input/RadioGroup";
import Toggle from "../_components/input/Toggle";
import Toolbar from "./components/Toolbar";
import Layout from "../_components/layout/Layout";

const ViewCategories: Component = () => {
    const [area, { setCategoriesView, setCategoriesFilters }] = useAreaSettingsContext();
    const [listing, { setShowLabels }] = useListingSettingsContext();

    return (
        <Layout toolbar={<Toolbar />} title="Categories">
            <PanelContainer>
                <Panel title="Category Page">
                    <RadioGroup
                        title="View"
                        itemArray={allCategoryViewModes}
                        groupName="pageView"
                        selectedValue={area.categoriesView}
                        onChange={setCategoriesView}
                    />
                    <Toggle
                        title="Show Labels"
                        name="categoryLabels"
                        isSelected={listing.labels.categories}
                        onChange={show => setShowLabels("categories", show)}
                    />
                </Panel>

                <Panel title="Filters">
                    <CategoryFilterOptions
                        filters={area.categoriesFilters}
                        onChange={changes =>
                            setCategoriesFilters({ ...area.categoriesFilters, ...changes })
                        }
                    />
                </Panel>
            </PanelContainer>
        </Layout>
    );
};

export default ViewCategories;
