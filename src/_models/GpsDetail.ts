import { GpsCoordinate } from "./GpsCoordinate";

export type GpsDetail = {
    recorded: GpsCoordinate;
    override: GpsCoordinate;
};
