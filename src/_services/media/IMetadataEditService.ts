import { GpsCoordinate } from '../../_api/_models/GpsCoordinate';
import { GpsDetail } from '../../_api/_models/GpsDetail';

export interface IMetadataEditService {
    fetchGpsDetail: (id: number) => Promise<GpsDetail>;
    setGpsCoordinateOverride: (id: number, gps: GpsCoordinate) => Promise<Response>;
}
