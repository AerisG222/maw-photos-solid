import { IRatingService } from './IRatingService';

import { getRating, ratePhoto } from '../api/Photos';

export class PhotoMediaService implements IRatingService {
    fetchRating = getRating;
    setRating = ratePhoto;
}
