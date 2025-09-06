import { GpsDetail } from "../../_models/GpsDetail";
import { Media } from "../../_models/Media";

export interface MediaWithGps {
    media: Media;
    gps: GpsDetail;
}
