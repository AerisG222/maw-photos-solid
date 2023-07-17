import { createContext, ParentComponent, useContext } from 'solid-js';

import { IExifService } from '../_services/media/IExifService';

const ExifServiceContext = createContext<IExifService>(undefined);

type Props = {
    svc: IExifService
};

export const ExifServiceProvider: ParentComponent<Props> = (props) => {
    return (
        <ExifServiceContext.Provider value={props.svc}>
            {props.children}
        </ExifServiceContext.Provider>
    );
};

export const useExifServiceContext = () => useContext(ExifServiceContext);
