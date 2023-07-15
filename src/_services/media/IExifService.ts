import { ExifDetail } from '../../_api/_models/ExifDetail';

export interface IExifService {
    fetchExif: (id: number) => Promise<ExifDetail>;
}
