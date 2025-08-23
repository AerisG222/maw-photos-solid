import { Component } from "solid-js";

import { useCategoryContext } from "../../_contexts/CategoryContext";

import ToolbarExternalLink from "../../_components/toolbar/ToolbarExternalLink";

const DownloadCategoryButton: Component = () => {
    const [categoryState] = useCategoryContext();

    const getLink = () => {
        if (categoryState.activeCategory) {
            return categoryState.activeCategory.downloadLink; // TODO
        }

        return "";
    };

    return (
        <ToolbarExternalLink
            name="Download"
            tooltip="Download All Photos in Category (.zip)"
            url={getLink()}
            iconClass="icon-[ic--outline-file-download]"
        />
    );
};

export default DownloadCategoryButton;
