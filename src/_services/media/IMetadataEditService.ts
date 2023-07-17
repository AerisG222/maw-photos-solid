import { GpsCoordinate, GpsDetail } from '../../_models/Gps';

export interface IMetadataEditService {
    fetchGpsDetail: (id: number) => Promise<GpsDetail>;
    setGpsCoordinateOverride: (id: number, gps: GpsCoordinate) => Promise<Response>;
}
