import { GpsCoordinate } from '../../_api/models/GpsCoordinate';
import { GpsDetail } from '../../_api/models/GpsDetail';

export interface IMetadataEditService {
    fetchGpsDetail: (id: number) => Promise<GpsDetail>;
    setGpsCoordinateOverride: (id: number, gps: GpsCoordinate) => Promise<Response>;
}
