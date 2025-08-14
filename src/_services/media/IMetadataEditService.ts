import { GpsCoordinate } from '../../_models/GpsCoordinate';
import { GpsDetail } from '../../_models/GpsDetail';

export interface IMetadataEditService {
    fetchGpsDetail: (id: Uuid) => Promise<GpsDetail | undefined>;
    setGpsCoordinateOverride: (id: Uuid, gps: GpsCoordinate) => Promise<Response | undefined>;
}
