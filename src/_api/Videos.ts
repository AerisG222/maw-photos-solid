import { ApiCollection } from './models/ApiCollection';
import { Comment } from './models/Comment';
import { ApiGpsCoordinate } from './models/ApiGpsCoordinate';
import { ApiGpsDetail } from './models/ApiGpsDetail';
import { Rating } from './models/Rating';
import { patchMawApi, postMawApi, queryMawApi } from './Shared';

export const getRating = (videoId: number) =>
    queryMawApi<Rating>(`videos/${videoId}/rating`);

export const rateVideo = (videoId: number, rating: number) =>
    patchMawApi(`videos/${videoId}/rating`, { videoId, rating });

export const getComments = async (videoId: number) => {
    const comments = await queryMawApi<ApiCollection<Comment>>(`videos/${videoId}/comments`);

    for(let c of comments.items) {
        c.entryDate = c.entryDate ? new Date(c.entryDate) : null
    }

    return comments;
}

export const addComment = (videoId: number, comment: string) =>
    postMawApi(`videos/${videoId}/comments`, { comment });

export const getGpsDetail = (videoId: number) =>
    queryMawApi<ApiGpsDetail>(`videos/${videoId}/gps`);

export const setGpsCoordinateOverride = (videoId: number, gps: ApiGpsCoordinate) =>
    patchMawApi(`videos/${videoId}/gps`, gps);
