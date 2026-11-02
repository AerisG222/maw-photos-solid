import { useAreaSettingsContext } from "../../_contexts/settings/AreaSettingsContext";
import type { FeedListing } from "../../_contexts/settings/AreaSettingsContext";
import type { LabelArea } from "../../_contexts/settings/ListingSettingsContext";
import { MediaFilters } from "../../_models/MediaFilters";
import { FeedSubject } from "./_routes";

/*
   The pages are shared, but the settings are not: a person and a clan are browsed
   under People, and a place under Places, so each keeps its own.
*/
export const feedLabelArea = (subject: FeedSubject): LabelArea =>
    subject.kind === "place" ? "placeFeeds" : "personFeeds";

export const useFeedPreferences = () => {
    const [
        ,
        { setPersonFeedListing, setPlaceFeedListing, setPersonFeedFilters, setPlaceFeedFilters }
    ] = useAreaSettingsContext();

    return {
        rememberListing: (subject: FeedSubject, listing: FeedListing) =>
            (subject.kind === "place" ? setPlaceFeedListing : setPersonFeedListing)(listing),
        rememberFilters: (subject: FeedSubject, filters: MediaFilters) =>
            (subject.kind === "place" ? setPlaceFeedFilters : setPersonFeedFilters)(filters)
    };
};
