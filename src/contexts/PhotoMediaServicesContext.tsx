import { createContext, ParentComponent, useContext } from 'solid-js';
import { createStore } from "solid-js/store";

import { IMediaService } from '../services/IMediaService';

export type MediaServicesState = {
    readonly svc: IMediaService;
};

export const defaultMediaServiceState: MediaServicesState = {
    svc: undefined
};

export type MediaServiceContextValue = [
    state: MediaServicesState
];

const MediaServiceContext = createContext<MediaServiceContextValue>([
    defaultMediaServiceState
]);

type Props = {
    svc: IMediaService
};

export const MediaServiceProvider: ParentComponent<Props> = (props) => {
    const [state] = createStore({svc: props.svc});

    return (
        <MediaServiceContext.Provider value={[state]}>
            {props.children}
        </MediaServiceContext.Provider>
    );
}

export const useMediaServiceContext = () => useContext(MediaServiceContext);
