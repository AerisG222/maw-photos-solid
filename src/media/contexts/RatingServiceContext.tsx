import { useContext } from 'solid-js';

import { buildServiceContext } from '../../_models/utils/ServiceContextUtil';
import { IRatingService } from '../../_services/media/IRatingService';

export const {
    ServiceContext: RatingServiceContext,
    ServiceProvider: RatingServiceProvider
} = buildServiceContext<IRatingService>();

export const useRatingServiceContext = () => useContext(RatingServiceContext);
