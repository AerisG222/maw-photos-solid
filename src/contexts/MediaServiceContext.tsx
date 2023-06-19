import { createContext, ParentComponent, useContext } from 'solid-js';

import { IMediaService } from '../services/IMediaService';

const MediaServiceContext = createContext<IMediaService>({
    fetchRating: () => undefined,
    setRating: () => undefined
});

type Props = {
    svc: IMediaService
};

export const MediaServiceProvider: ParentComponent<Props> = (props) => {
    return (
        <MediaServiceContext.Provider value={props.svc}>
            {props.children}
        </MediaServiceContext.Provider>
    );
}

export const useMediaServiceContext = () => useContext(MediaServiceContext);
