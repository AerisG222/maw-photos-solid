export interface IMediaService {
    fetchRating: (id: number) => void;
    setRating: (id: number, rating: number) => void;
}
