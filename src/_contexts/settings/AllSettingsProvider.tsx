import { ParentComponent } from "solid-js";

import { AppSettingsProvider } from "./AppSettingsContext";
import { AreaSettingsProvider } from "./AreaSettingsContext";
import { ListingSettingsProvider } from "./ListingSettingsContext";
import { MediaSettingsProvider } from "./MediaSettingsContext";

/*
   Four providers, where there were eighteen.

   Every other file in this directory is now an adapter over one of these - it
   presents the shape its callers already expect, and owns nothing. That is why
   a preference set while browsing a category now follows you into a search,
   a person's photographs or a place: there is only one of it.
*/
export const AllSettingsProvider: ParentComponent = props => {
    return (
        <AppSettingsProvider>
            <ListingSettingsProvider>
                <MediaSettingsProvider>
                    <AreaSettingsProvider>{props.children}</AreaSettingsProvider>
                </MediaSettingsProvider>
            </ListingSettingsProvider>
        </AppSettingsProvider>
    );
};
