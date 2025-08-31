import { GpsDetail } from '../../_models/GpsDetail';
import { Media } from '../../_models/Media';

export type MediaWithGps = {
    media: Media;
    gps: GpsDetail;
};
