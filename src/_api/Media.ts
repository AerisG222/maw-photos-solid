import { patchMawApi, postMawApi, queryMawApi } from "./Shared";
import { Comment } from "../_models/Comment";
import { Media } from "../_models/Media";
import { GpsDetail } from "../_models/GpsDetail";
import { GpsCoordinate } from "../_models/GpsCoordinate";

export const getRandomMedia = async (count: number): Promise<Media[]> =>
    await internalGetRandomMedia(count);

export const getExifData = (mediaId: Uuid) => queryMawApi<object>(`media/${mediaId}/metadata`);

export const setIsFavorite = (mediaId: Uuid, isFavorite: boolean) =>
    patchMawApi(`media/${mediaId}/favorite`, { mediaId, isFavorite });

export const getComments = async (mediaId: Uuid) => {
    const comments = (await queryMawApi<Comment[]>(`media/${mediaId}/comments`)) ?? [];

    for (let c of comments) {
        c.created = new Date(c.created);
    }

    return comments;
};

export const addComment = (mediaId: Uuid, comment: string) =>
    postMawApi(`media/${mediaId}/comments`, { comment });

export const getGpsDetail = (mediaId: Uuid) => queryMawApi<GpsDetail>(`media/${mediaId}/gps`);

export const setGpsCoordinateOverride = (mediaId: Uuid, gps: GpsCoordinate) =>
    patchMawApi(`media/${mediaId}/gps`, gps);

const internalGetRandomMedia = async (count: number) =>
    (await queryMawApi<Media[]>(`media/random/${count}`)) ?? [];
