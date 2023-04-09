import { createQuery } from '@tanstack/solid-query';
import { accessToken } from '../auth/auth';
import { PhotoCategory } from '../models/api/PhotoCategory';
import { ApiCollection } from '../models/api/ApiCollection';

export const getPhotoCategories = () => {
    return createQuery<ApiCollection<PhotoCategory>>(
        () => ["photo_categories"],
        () => queryMawApi('photo-categories'),
    );
}

const buildAbsoluteUrl = (relativeUrl: string): string => {
    return `${import.meta.env.VITE_API_URI}/${relativeUrl}`;
}

const queryMawApi = async (relativeUrl: string) => {
    const response = await fetch(
        buildAbsoluteUrl(relativeUrl),
        {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${accessToken()}`
            }
        });

    return await response.json();
};
