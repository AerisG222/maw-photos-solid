import { useContext } from "solid-js";

import { IMetadataEditService } from "../../_services/media/IMetadataEditService";
import { buildServiceContext } from "../../_models/utils/ServiceContextUtil";

export const {
    ServiceContext: MetadataEditServiceContext,
    ServiceProvider: MetadataEditServiceProvider
} = buildServiceContext<IMetadataEditService>();

export const useMetadataEditServiceContext = () => {
    const ctx = useContext(MetadataEditServiceContext);

    if (ctx) {
        return ctx;
    }

    throw new Error("MetadataEditService context not provided by ancestor component!");
};
