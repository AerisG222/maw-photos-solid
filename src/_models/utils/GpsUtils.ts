import { GpsCoordinate } from "../GpsCoordinate";

export interface GpsOverride {
    lat: string | undefined;
    lng: string | undefined;
}

export const isValidLatLng = (val?: string) => {
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
        longitude: lng
    };
};

// the "latitude,longitude" form parseGps reads back, for pasting as an override elsewhere
export const formatGps = (gps: GpsCoordinate) => `${gps.latitude},${gps.longitude}`;

// false when there is no clipboard to write to - outside a secure context, or permission refused
export const copyGps = async (gps: GpsCoordinate) => {
    try {
        await navigator.clipboard.writeText(formatGps(gps));

        return true;
    } catch {
        return false;
    }
};

// google maps itself at this spot - street view, directions and all - with no api or key involved
export const getGoogleMapsUrl = (gps: GpsCoordinate) =>
    `https://www.google.com/maps/search/?api=1&query=${formatGps(gps)}`;
