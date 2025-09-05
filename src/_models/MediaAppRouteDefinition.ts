import { MediaView } from './MediaView';
import { AppRouteDefinition } from './AppRouteDefinition';
import { Category } from './Category';
import { Media } from './Media';

export type MediaAppRouteDefinition = AppRouteDefinition & {
    mediaView?: MediaView;
    buildPathForMedia(category: Category | undefined, media: Media | undefined): string;
}

export const isMediaAppRouteDefinition = (route: AppRouteDefinition | MediaAppRouteDefinition): route is MediaAppRouteDefinition =>
    'mediaView' in route;
