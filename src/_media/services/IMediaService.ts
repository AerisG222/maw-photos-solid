import { Category } from '../../_models/Category';
import { Media } from '../../_models/Media';
import { MediaAppRouteDefinition } from '../../_models/MediaAppRouteDefinition';
import { MediaView } from '../models/MediaView';
import { INavigable } from './INavigable';

export interface IMediaService extends INavigable {
    getMediaList(): Media[];
    getActiveCategory(): Category | undefined;
    getActiveMedia(): Media | undefined;
    navigateToMedia(view: MediaView, media: Media): void;
    navigateToFirstMediaIfNeeded(): void;
    getAvailableRoutes(): MediaAppRouteDefinition[];
    getEntryPathByView(view: MediaView): string;
    getMediaPathByView(view: MediaView, media: Media | undefined): string;
};
