import { createContext, ParentComponent, useContext } from 'solid-js';

import { IRatingService } from '../models/services/IRatingService';

const RatingServiceContext = createContext<IRatingService>(undefined);

type Props = {
    svc: IRatingService
};

export const RatingServiceProvider: ParentComponent<Props> = (props) => {
    return (
        <RatingServiceContext.Provider value={props.svc}>
            {props.children}
        </RatingServiceContext.Provider>
    );
}

export const useRatingServiceContext = () => useContext(RatingServiceContext);
