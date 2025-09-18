import { Uuid } from './Uuid';

export interface GpsOverrideRequest {
    mediaId: Uuid;
    latitude: number;
    longitude: number;
}
