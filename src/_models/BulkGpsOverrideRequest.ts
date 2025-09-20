import { GpsCoordinate } from "./GpsCoordinate";
import { Uuid } from "./Uuid";

export interface BulkGpsOverrideRequest {
    mediaIds: Uuid[];
    gpsCoordinate: GpsCoordinate;
}
