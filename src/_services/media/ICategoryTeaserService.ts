export interface ICategoryTeaserService {
    setTeaser: (categoryId: number, id: number) => Promise<Response>;
}
