import { useContext } from 'solid-js';

import { ICategoryTeaserService } from '../_services/media/ICategoryTeaserService';
import { buildServiceContext } from '../_models/utils/ServiceContextUtil';

export const {
    ServiceContext: CategoryTeaserServiceContext,
    ServiceProvider: CategoryTeaserServiceProvider
} = buildServiceContext<ICategoryTeaserService>();

export const useCategoryTeaserServiceContext = () => useContext(CategoryTeaserServiceContext);
