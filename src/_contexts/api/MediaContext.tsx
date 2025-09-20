import { Accessor, createContext, ParentComponent, useContext } from "solid-js";
import {
    InfiniteData,
    useInfiniteQuery,
    UseInfiniteQueryResult,
    useMutation,
    UseMutationResult,
    useQuery,
    useQueryClient,
    UseQueryResult
} from "@tanstack/solid-query";

import { Comment } from "../../_models/Comment";
import { useAuthContext } from "../AuthContext";
import { postApi, queryApi, runWithAccessToken } from "./_shared";
import { Media } from "../../_models/Media";
import { GpsDetail } from "../../_models/GpsDetail";
import { AddCommentRequest } from "../../_models/AddCommentRequest";
import { Uuid } from "../../_models/Uuid";
import { IsFavoriteRequest } from "../../_models/IsFavoriteRequest";
import { parseISO } from "date-fns";
import { GpsOverrideRequest } from "../../_models/GpsOverrideRequest";
import { BulkGpsOverrideRequest } from "../../_models/BulkGpsOverrideRequest";

export interface MediaService {
    mediaQuery: (id: Accessor<Uuid>) => UseQueryResult<Media | undefined, Error>;
    metadataQuery: (id: Accessor<Uuid>) => UseQueryResult<object, Error>;
    commentsQuery: (id: Accessor<Uuid>) => UseQueryResult<Comment[], Error>;
    gpsQuery: (id: Accessor<Uuid>) => UseQueryResult<GpsDetail, Error>;
    randomMediaQuery: (
        count: number
    ) => UseInfiniteQueryResult<InfiniteData<Media[] | undefined>, Error>;
    addCommentMutation: UseMutationResult<Response, Error, AddCommentRequest, unknown>;
    setIsFavoriteMutation: UseMutationResult<Response, Error, IsFavoriteRequest<Media>, unknown>;
    setGpsOverrideMutation: UseMutationResult<Response, Error, GpsOverrideRequest, unknown>;
    bulkGpsOverrideMutation: UseMutationResult<Response, Error, BulkGpsOverrideRequest, unknown>;
}

const MediaContext = createContext<MediaService>();

export const MediaProvider: ParentComponent = props => {
    const [authContext, { getToken }] = useAuthContext();
    const queryClient = useQueryClient();

    const fetchMedia = async (id?: Uuid) =>
        runWithAccessToken(getToken, accessToken => queryApi<Media>(accessToken, `media/${id}`));

    const fetchRandom = async (count: number) =>
        runWithAccessToken(getToken, accessToken =>
            queryApi<Media[]>(accessToken, `media/random/${count}`)
        );

    const fetchMetadata = async (id: Uuid) =>
        runWithAccessToken(getToken, accessToken =>
            queryApi<object>(accessToken, `media/${id}/metadata`)
        );

    const fetchComments = async (id: Uuid) =>
        runWithAccessToken(getToken, async accessToken => {
            const comments = await queryApi<Comment[]>(accessToken, `media/${id}/comments`);

            for (const c of comments) {
                c.created = parseISO(c.created as string);
            }

            return comments;
        });

    const fetchGps = async (id: Uuid) =>
        runWithAccessToken(getToken, async accessToken => {
            try {
                return await queryApi<GpsDetail>(accessToken, `media/${id}/gps`);
            } catch {
                return {
                    mediaId: id,
                    recorded: { latitude: undefined, longitude: undefined },
                    override: { latitude: undefined, longitude: undefined }
                };
            }
        });

    const postComment = async (req: AddCommentRequest) =>
        runWithAccessToken(getToken, accessToken =>
            postApi(accessToken, `media/${req.mediaId}/comments`, { body: req.comment })
        );

    const postIsFavorite = async (req: IsFavoriteRequest<Media>) =>
        runWithAccessToken(getToken, accessToken =>
            postApi(accessToken, `media/${req.item.id}/favorite`, {
                isFavorite: req.isFavorite
            })
        );

    const postGpsOverride = async (req: GpsOverrideRequest) =>
        runWithAccessToken(getToken, accessToken =>
            postApi(accessToken, `media/${req.mediaId}/gps`, {
                latitude: req.latitude,
                longitude: req.longitude
            })
        );

    const postBulkGpsOverride = async (req: BulkGpsOverrideRequest) =>
        runWithAccessToken(getToken, accessToken =>
            postApi(accessToken, `media/bulk-gps-override`, {
                mediaIds: req.mediaIds,
                gpsCoordinate: req.gpsCoordinate
            })
        );

    const randomMediaQuery = (count: number) =>
        useInfiniteQuery(() => ({
            queryKey: ["media", "random"],
            queryFn: () => fetchRandom(count),
            enabled: count > 0 && authContext.isLoggedIn,
            staleTime: Infinity,
            initialPageParam: 0,
            getNextPageParam: (lastPage, pages) => pages.length,
            maxPages: 120
        }));

    const mediaQuery = (id: Accessor<Uuid | undefined>) =>
        useQuery(() => ({
            queryKey: ["media", id()],
            queryFn: () => fetchMedia(id()),
            enabled: !!id() && authContext.isLoggedIn,
            staleTime: 15 * 60 * 1000
        }));

    const metadataQuery = (id: Accessor<Uuid>) =>
        useQuery(() => ({
            queryKey: ["media", id(), "metadata"],
            queryFn: () => fetchMetadata(id()),
            enabled: !!id() && authContext.isLoggedIn,
            staleTime: 15 * 60 * 1000
        }));

    const commentsQuery = (id: Accessor<Uuid>) =>
        useQuery(() => ({
            queryKey: ["media", id(), "comments"],
            queryFn: () => fetchComments(id()),
            enabled: !!id() && authContext.isLoggedIn
        }));

    const gpsQuery = (id: Accessor<Uuid>) =>
        useQuery(() => ({
            queryKey: ["media", id(), "gps"],
            queryFn: () => fetchGps(id()),
            enabled: !!id() && authContext.isLoggedIn,
            staleTime: 15 * 60 * 1000
        }));

    const addCommentMutation = useMutation(() => ({
        mutationFn: (req: AddCommentRequest) => postComment(req),
        onSuccess: async (data, req) => {
            await queryClient.invalidateQueries({
                queryKey: ["media", req.mediaId, "comments"],
                refetchType: "all"
            });
        }
    }));

    // todo: optimize if this starts getting used more
    const setIsFavoriteMutation = useMutation(() => ({
        mutationFn: (isFavoriteReq: IsFavoriteRequest<Media>) => postIsFavorite(isFavoriteReq),
        onSettled: async () => {
            await queryClient.invalidateQueries({
                queryKey: ["media", "random"],
                refetchType: "all"
            });

            await queryClient.invalidateQueries({
                queryKey: ["categories"],
                refetchType: "all"
            });
        }
    }));

    const setGpsOverrideMutation = useMutation(() => ({
        mutationFn: (gpsOverrideRequest: GpsOverrideRequest) => postGpsOverride(gpsOverrideRequest),
        onSettled: async (data, errs, variables) => {
            await queryClient.invalidateQueries({
                queryKey: ["media", variables.mediaId, "gps"],
                refetchType: "all"
            });

            await queryClient.invalidateQueries({
                queryKey: ["categories"],
                refetchType: "all"
            });
        }
    }));

    const bulkGpsOverrideMutation = useMutation(() => ({
        mutationFn: (overrideRequest: BulkGpsOverrideRequest) =>
            postBulkGpsOverride(overrideRequest),
        onSettled: async (data, errs, variables) => {
            await queryClient.invalidateQueries({
                queryKey: ["media"],
                refetchType: "all"
            });

            await queryClient.invalidateQueries({
                queryKey: ["categories"],
                refetchType: "all"
            });
        }
    }));

    return (
        <MediaContext.Provider
            value={{
                mediaQuery,
                metadataQuery,
                commentsQuery,
                gpsQuery,
                randomMediaQuery,
                addCommentMutation,
                setIsFavoriteMutation,
                setGpsOverrideMutation,
                bulkGpsOverrideMutation
            }}
        >
            {props.children}
        </MediaContext.Provider>
    );
};

export const useMediaContext = () => {
    const ctx = useContext(MediaContext);

    if (ctx) {
        return ctx;
    }

    throw new Error("Media context not provided by ancestor component!");
};
