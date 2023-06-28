export type Photo = {
    id: number;
    categoryId: number;
    createDate: Date;
    latitude?: number;
    longitude?: number;
    imageXsUrl: string;
    imageXsWidth: number;
    imageXsSqUrl: string;
    imageSmUrl: string;
    imageSmWidth: number;
    imageMdUrl: string;
    imageMdWidth: number;
    imageLgUrl: string;
    imageLgWidth: number;
    imagePrtUrl: string;
};
