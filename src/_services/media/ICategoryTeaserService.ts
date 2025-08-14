export interface ICategoryTeaserService {
    setTeaser: (categoryId: Uuid, id: Uuid) => Promise<Response | undefined>;
}
