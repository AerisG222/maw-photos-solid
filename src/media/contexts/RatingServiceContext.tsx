import { useContext } from "solid-js";

import { buildServiceContext } from "../../_models/utils/ServiceContextUtil";
import { IFavoriteService } from "../../_services/media/IFavoriteService";

export const { ServiceContext: RatingServiceContext, ServiceProvider: RatingServiceProvider } =
    buildServiceContext<IFavoriteService>();

export const useRatingServiceContext = () => {
    const ctx = useContext(RatingServiceContext);

    if (ctx) {
        return ctx;
    }

    throw new Error("RatingService context not provided by ancestor component!");
};
