import { createQuery } from '@tanstack/solid-query';

export const getCategories = (accessToken: string) => {
    return createQuery({
        queryKey: () => ["photo_categories"],
        queryFn: () => fetchPhotoCategories(accessToken)
    });
}

const fetchPhotoCategories = async (accessToken: string) => {
    const response = await fetch(
        `${import.meta.env.VITE_API_URI}/photo-categories`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${accessToken}`
            }
        });

    return await response.json();
};
