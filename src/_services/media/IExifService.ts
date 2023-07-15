import { ExifDetail } from '../../api/models/ExifDetail';

export interface IExifService {
    fetchExif: (id: number) => Promise<ExifDetail>;
}
