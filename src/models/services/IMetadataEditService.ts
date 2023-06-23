import { GpsCoordinate } from '../../api/models/GpsCoordinate';
import { GpsDetail } from '../../api/models/GpsDetail';

export interface IMetadataEditService {
    fetchGpsDetail: (id: number) => Promise<GpsDetail>;
    setGpsCoordinateOverride: (id: number, gps: GpsCoordinate) => Promise<Response>;
}
