export type Photo = {
    id: number;
    categoryId: number;
    createDate: Date;
    latitude?: number;
    longitude?: number;
    imageXsUrl: string;
    imageXsSqUrl: string;
    imageSmUrl: string;
    imageMdUrl: string;
    imageLgUrl: string;
    imagePrtUrl: string;
};
