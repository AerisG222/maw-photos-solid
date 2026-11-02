import {
    LabelArea,
    useListingSettingsContext
} from "../../_contexts/settings/ListingSettingsContext";
import { ThumbnailSizeDefault, getThumbnailSize } from "../../_models/ThumbnailSize";
import { categoryRowHeight } from "../listing/_rows";

const THUMBNAIL_HEIGHT = getThumbnailSize(ThumbnailSizeDefault).height;

// how tall a row of CategoryCards is, which follows whether their labels are shown
export const useCategoryRowHeight = (area: LabelArea, options?: { hideYear?: boolean }) => {
    const [listing] = useListingSettingsContext();

    return () => categoryRowHeight(THUMBNAIL_HEIGHT, listing.labels[area], !options?.hideYear);
};
