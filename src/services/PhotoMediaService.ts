import { IMediaService } from './IMediaService';

import { getRating, ratePhoto } from '../api/Photos';

export class PhotoMediaService implements IMediaService {
    fetchRating = getRating;
    setRating = ratePhoto;
}
