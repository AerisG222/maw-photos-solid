import { Category } from '../../_models/Category';
import { Media } from '../../_models/Media';
import { MediaView } from '../models/MediaView';
import { INavigable } from './INavigable';

export interface IMediaService extends INavigable {
    getMediaList(): Media[];
    getActiveCategory(): Category | undefined;
    getActiveMedia(): Media | undefined;
    navigateToMedia(mediaId: Uuid, mode: MediaView): void;
    navigateToFirstMediaIfNeeded(): void;
};
