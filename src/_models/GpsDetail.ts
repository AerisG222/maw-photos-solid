import { Uuid } from './Uuid';
import { GpsCoordinate } from "./GpsCoordinate";

export type GpsDetail = {
    mediaId: Uuid;
    recorded: GpsCoordinate | undefined;
    override: GpsCoordinate | undefined;
};
