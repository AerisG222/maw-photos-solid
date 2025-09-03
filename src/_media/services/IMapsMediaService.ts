import { GpsCoordinate } from '../../_models/GpsCoordinate';
import { MediaWithGps } from '../models/MediaWithGps';
import { IMediaService } from './IMediaService';

export interface IMapsMediaService extends IMediaService {
    isReady: () => boolean;
    mediaWithGps: () => MediaWithGps[];
    activeMediaGps: () => GpsCoordinate | undefined;
    preferredGpsLocation: (mediaWithGps: MediaWithGps | undefined) => GpsCoordinate | undefined;
};
