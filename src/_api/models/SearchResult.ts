export type SearchResult<T> = {
    results: T[];
    totalFound: number;
    startIndex: number;
};

export type SearchCategory  = {
    solrId: string;
    id: number;
    year: number;
    name: string;
    multimediaType: string;
    teaserPhotoHeight: number;
    teaserPhotoWidth: number;
    teaserPhotoPath: string;
    teaserPhotoSqHeight: number;
    teaserPhotoSqWidth: number;
    teaserPhotoSqPath: string;
    score: number;
};
