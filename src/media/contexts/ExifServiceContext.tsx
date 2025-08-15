import { useContext } from "solid-js";

import { buildServiceContext } from "../../_models/utils/ServiceContextUtil";
import { IExifService } from "../../_services/media/IExifService";

export const { ServiceContext: ExifServiceContext, ServiceProvider: ExifServiceProvider } =
    buildServiceContext<IExifService>();

export const useExifServiceContext = () => {
    const ctx = useContext(ExifServiceContext);

    if (ctx) {
        return ctx;
    }

    throw new Error("ExifService context not provided by ancestor component!");
};
