import { MediaFileType } from './MediaFileType';
import { Uuid } from './Uuid';

export type MediaFile = {
    id: Uuid;
    scale: string;
    type: MediaFileType;
    path: string;
};
