import { MediaFileType } from './MediaFileType';
import { Uuid } from './Uuid';

export interface MediaFile {
    id: Uuid;
    scale: string;
    type: MediaFileType;
    path: string;
}
