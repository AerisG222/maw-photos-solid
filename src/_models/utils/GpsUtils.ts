import { GpsCoordinate } from "../Gps";

export type GpsOverride = {
    lat: string | undefined,
    lng: string | undefined
};

export const isValidLatLng = (val: string) => {
    return val !== undefined && !isNaN(parseFloat(val));
};

export const parseGps = (val: string): GpsCoordinate | undefined => {
    const parts = val
        .trim()
        .replace("[", "")
        .replace("]", "")
        .replace("(", "")
        .replace(")", "")
        .split(",");

    if (parts.length !== 2) {
        return undefined;
    }

    const lat = Number(parts[0]);
    const lng = Number(parts[1]);

    if (isNaN(lat) || isNaN(lng)) {
        return undefined;
    }

    return {
        latitude: lat,
        longitude: lng,
    };
};
