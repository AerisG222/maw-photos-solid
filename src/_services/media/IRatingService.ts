import { Rating } from '../../_api/_models/Rating';

export interface IRatingService {
    fetchRating: (id: number) => Promise<Rating>;
    setRating: (id: number, rating: number) => Promise<Response>;
}
