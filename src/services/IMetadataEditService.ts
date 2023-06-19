import { GpsCoordinate } from '../models/api/GpsCoordinate';
import { GpsDetail } from '../models/api/GpsDetail';

export interface IMetadataEditService {
    fetchGpsDetail: (id: number) => Promise<GpsDetail>;
    setGpsCoordinateOverride: (id: number, gps: GpsCoordinate) => Promise<Response>;
}
