import { useContext } from "solid-js";

import { ICategoryTeaserService } from "../../_services/media/ICategoryTeaserService";
import { buildServiceContext } from "../../_models/utils/ServiceContextUtil";

export const {
    ServiceContext: CategoryTeaserServiceContext,
    ServiceProvider: CategoryTeaserServiceProvider
} = buildServiceContext<ICategoryTeaserService>();

export const useCategoryTeaserServiceContext = () => {
    const ctx = useContext(CategoryTeaserServiceContext);

    if (ctx) {
        return ctx;
    }

    throw new Error("CategoryTeaserService context not provided by ancestor component!");
};
