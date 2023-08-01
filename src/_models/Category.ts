import { CategoryType } from "./CategoryType";

export type Category = {
    id: number;
    type: CategoryType;
    name: string;
    year: number;
    createDate: Date;
    teaserImageUrl: string;
    latitude?: number;
    longitude?: number;
    count: number;
    totalSize: number;
    isMissingGpsData: boolean;
    route: string;
};

export type PhotoCategory = Category & {
    downloadLink: string;
};

export type VideoCategory = Category & {
    totalDuration: number;
};
