import { MultimediaAsset } from './api/MultimediaAsset';

export type CategoryTeaser = {
    route: string;
    id: number;
    year: number;
    name: string;
    type: 'photo' | 'video';
    teaserImage: MultimediaAsset;
    teaserImageSq: MultimediaAsset;
}
