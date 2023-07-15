import { createContext, ParentComponent, useContext } from 'solid-js';

import { IMetadataEditService } from '../_models/services/IMetadataEditService';

const MetadataEditServiceContext = createContext<IMetadataEditService>(undefined);

type Props = {
    svc: IMetadataEditService;
};

export const MetadataEditServiceProvider: ParentComponent<Props> = (props) => {
    return (
        <MetadataEditServiceContext.Provider value={props.svc}>
            {props.children}
        </MetadataEditServiceContext.Provider>
    );
};

export const useMetadataEditServiceContext = () => useContext(MetadataEditServiceContext);
