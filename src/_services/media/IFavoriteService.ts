export interface IFavoriteService {
    setIsFavorite: (id: Uuid, isFavorite: boolean) => Promise<Response | undefined>;
}
