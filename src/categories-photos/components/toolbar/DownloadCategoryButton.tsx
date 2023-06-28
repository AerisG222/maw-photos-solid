import { Component } from 'solid-js';

import { useCategoryContext } from '../../../contexts/CategoryContext';
import { PhotoCategory } from '../../../models/Category';

import ToolbarExternalLink from '../../../components/toolbar/ToolbarExternalLink';

const DownloadCategoryButton: Component = () => {
    const [categoryState] = useCategoryContext();

    const getLink = () => {
        if(categoryState.activeCategory && categoryState.activeCategory.type === 'photo'){
            return (categoryState.activeCategory as PhotoCategory).downloadLink;
        }

        return '';
    }

    return (
        <ToolbarExternalLink
            title="Download All Photos in Category (.zip)"
            url={getLink()}
            iconClass='i-ic-outline-file-download' />
    );
}

export default DownloadCategoryButton;
