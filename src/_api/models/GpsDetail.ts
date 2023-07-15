import { GpsCoordinate } from './GpsCoordinate';

export type GpsDetail = {
    source: GpsCoordinate;
    override: GpsCoordinate;
};
