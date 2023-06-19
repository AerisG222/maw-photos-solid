import { ExifDetail } from '../models/api/ExifDetail';

export interface IExifService {
    fetchExif: (id: number) => Promise<ExifDetail>;
}
