import { Component } from "solid-js";

import { Category } from "../../_models/Category";
import { buildCategoryDownloadUrl } from "../../_contexts/api/_shared";

import ToolbarExternalLink from "../../_components/toolbar/ToolbarExternalLink";

type Props = {
    category?: Category;
};

const DownloadCategoryButton: Component<Props> = props => {
    return (
        <ToolbarExternalLink
            name="Download"
            tooltip="Download All Photos in Category (.zip)"
            url={props.category?.id ? buildCategoryDownloadUrl(props.category.id) : ""}
            iconClass="icon-[ic--outline-file-download]"
        />
    );
};

export default DownloadCategoryButton;
