import { Rating } from '../models/api/Rating';

export interface IRatingService {
    fetchRating: (id: number) => Promise<Rating>;
    setRating: (id: number, rating: number) => Promise<Response>;
}
