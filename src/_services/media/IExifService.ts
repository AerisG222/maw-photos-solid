export interface IExifService {
    fetchExif: (id: Uuid) => Promise<object | undefined>;
}
