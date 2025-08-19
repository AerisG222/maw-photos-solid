import { GpsCoordinate } from "./GpsCoordinate";

export type GpsDetail = {
    recorded: GpsCoordinate | undefined;
    override: GpsCoordinate | undefined;
};
