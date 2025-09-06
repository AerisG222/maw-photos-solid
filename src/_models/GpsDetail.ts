import { Uuid } from './Uuid';
import { GpsCoordinate } from "./GpsCoordinate";

export interface GpsDetail {
    mediaId: Uuid;
    recorded: GpsCoordinate | undefined;
    override: GpsCoordinate | undefined;
}
