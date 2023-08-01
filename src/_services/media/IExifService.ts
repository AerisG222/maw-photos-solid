import { ExifDetail } from "../../_api/models/ExifDetail";

export interface IExifService {
    fetchExif: (id: number) => Promise<ExifDetail>;
}
