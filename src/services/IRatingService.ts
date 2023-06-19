export interface IRatingService {
    fetchRating: (id: number) => void;
    setRating: (id: number, rating: number) => void;
}
