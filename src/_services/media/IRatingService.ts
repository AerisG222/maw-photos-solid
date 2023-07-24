import { Rating } from '../../_api/models/Rating';

export interface IRatingService {
    fetchRating: (id: number) => Promise<Rating>;
    setRating: (id: number, rating: number) => Promise<Response>;
}
