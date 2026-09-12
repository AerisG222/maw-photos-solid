/*
   An adapter, not a store.

   This preference now lives in one of the four stores beside this file; what
   remains here is the shape its callers already expect, so that consolidating
   the stores did not have to mean touching every screen at once. The callers
   move over in the steps that replace the toolbars, and then this file goes.
*/

import { MediaView } from "../../_models/MediaView";
import { useMediaSettingsContext } from "./MediaSettingsContext";

export interface MediaPageSettingsState {
    readonly view: MediaView;
    readonly slideshowDisplayDurationSeconds: number;
}

export type MediaPageSettingsContextValue = [
    state: MediaPageSettingsState,
    actions: {
        setView: (view: MediaView) => void;
        setSlideshowDisplayDurationSeconds: (seconds: number) => void;
    }
];

export const useMediaPageSettingsContext = (): MediaPageSettingsContextValue => {
    const [media, mediaActions] = useMediaSettingsContext();

    // getters, so reading a field inside a tracking scope still subscribes to it
    const state: MediaPageSettingsState = {
        get view() {
            return media.view;
        },
        get slideshowDisplayDurationSeconds() {
            return media.slideshowSeconds;
        }
    };

    return [
        state,
        {
            setView: view => mediaActions.setView(view),
            setSlideshowDisplayDurationSeconds: seconds => mediaActions.setSlideshowSeconds(seconds)
        }
    ];
};
