import { Component } from "solid-js";

import { Category } from "../../_models/Category";
import { buildCategoryDownloadUrl } from "../../_contexts/api/_shared";

import ToolbarDownloadLink from "../../_components/toolbar/ToolbarDownloadLink";

interface Props {
    category?: Category;
}

const DownloadCategoryButton: Component<Props> = props => {
    return (
        <ToolbarDownloadLink
            name="Download"
            tooltip="Download All Photos in Category (.zip)"
            url={props.category?.id ? buildCategoryDownloadUrl(props.category.id) : ""}
            iconClass="icon-[ic--outline-file-download]"
            downloadFileName={`${props.category?.year}-${props.category?.slug}.zip`}
        />
    );
};

export default DownloadCategoryButton;
