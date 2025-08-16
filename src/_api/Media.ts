import { patchApi, postApi, queryApi } from "../_contexts/api/_shared";
import { Comment } from "../_models/Comment";
import { Media } from "../_models/Media";
import { GpsDetail } from "../_models/GpsDetail";
import { GpsCoordinate } from "../_models/GpsCoordinate";

export const getRandomMedia = async (count: number): Promise<Media[]> =>
    await internalGetRandomMedia(count);

export const getExifData = (mediaId: Uuid) => queryApi<object>(`media/${mediaId}/metadata`);

export const setIsFavorite = (mediaId: Uuid, isFavorite: boolean) =>
    patchApi(`media/${mediaId}/favorite`, { mediaId, isFavorite });

export const getComments = async (mediaId: Uuid) => {
    const comments = (await queryApi<Comment[]>(`media/${mediaId}/comments`)) ?? [];

    for (let c of comments) {
        c.created = new Date(c.created);
    }

    return comments;
};

export const addComment = (mediaId: Uuid, comment: string) =>
    postApi(`media/${mediaId}/comments`, { comment });

export const getGpsDetail = (mediaId: Uuid) => queryApi<GpsDetail>(`media/${mediaId}/gps`);

export const setGpsCoordinateOverride = (mediaId: Uuid, gps: GpsCoordinate) =>
    patchApi(`media/${mediaId}/gps`, gps);

const internalGetRandomMedia = async (count: number) =>
    (await queryApi<Media[]>(`media/random/${count}`)) ?? [];
