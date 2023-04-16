import { MultimediaAsset } from './api/MultimediaAsset';

export interface IApiCategory {
    id: number;
    name: string;
    year: number;
    createDate: Date;
    teaserImage: MultimediaAsset;
    teaserImageSq: MultimediaAsset;
}

export interface ICategory extends IApiCategory {
    type: 'photo' | 'video';
}

export class Category<T extends IApiCategory> implements ICategory {
    public readonly route: string;

    constructor(
        public readonly actual: T,
        public readonly type: 'photo' | 'video'
    ) {
        this.route = 'xyz';
    }

    public get id() {
        return this.actual.id;
    }

    public get name() {
        return this.actual.name;
    }

    public get year() {
        return this.actual.year;
    }

    public get createDate() {
        return this.actual.createDate;
    }

    public get teaserImage() {
        return this.actual.teaserImage;
    }

    public get teaserImageSq() {
        return this.actual.teaserImageSq;
    }
}
