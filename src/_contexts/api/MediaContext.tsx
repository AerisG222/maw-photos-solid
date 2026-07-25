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

import { Comment, CommentDto, mapComment } from "../../_models/Comment";
import { useAuthContext } from "../AuthContext";
import { postApi, putApi, queryApi, runWithAccessToken } from "./_shared";
import { Media } from "../../_models/Media";
import { GpsDetail } from "../../_models/GpsDetail";
import { MediaMetadata } from "../../_models/MediaMetadata";
import { AddCommentRequest } from "../../_models/AddCommentRequest";
import { Uuid } from "../../_models/Uuid";
import { IsFavoriteRequest } from "../../_models/IsFavoriteRequest";
import { GpsOverrideRequest } from "../../_models/GpsOverrideRequest";
import { BulkGpsOverrideRequest } from "../../_models/BulkGpsOverrideRequest";
import { pulseFavorite } from "../../_components/icon/_favoritePulse";
import { patchById } from "./_cacheUtils";

export interface MediaService {
    mediaQuery: (id: Accessor<Uuid>) => UseQueryResult<Media | undefined, Error>;
    metadataQuery: (id: Accessor<Uuid>) => UseQueryResult<MediaMetadata, Error>;
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
            queryApi<MediaMetadata>(accessToken, `media/${id}/metadata`)
        );

    const fetchComments = async (id: Uuid) =>
        runWithAccessToken(getToken, async accessToken => {
            const comments = await queryApi<CommentDto[]>(accessToken, `media/${id}/comments`);

            return comments.map(mapComment);
        });

    const fetchGps = async (id: Uuid) =>
        runWithAccessToken(getToken, async accessToken => {
            try {
                return await queryApi<GpsDetail>(accessToken, `media/${id}/gps`);
            } catch {
                return {
                    mediaId: id,
                    recorded: undefined,
                    override: undefined
                } satisfies GpsDetail;
            }
        });

    const postComment = async (req: AddCommentRequest) =>
        runWithAccessToken(getToken, accessToken =>
            postApi(accessToken, `media/${req.mediaId}/comments`, { body: req.comment })
        );

    const postIsFavorite = async (req: IsFavoriteRequest<Media>) =>
        runWithAccessToken(getToken, accessToken =>
            putApi(accessToken, `media/${req.item.id}/favorite`, {
                isFavorite: req.isFavorite
            })
        );

    const postGpsOverride = async (req: GpsOverrideRequest) =>
        runWithAccessToken(getToken, accessToken =>
            putApi(accessToken, `media/${req.mediaId}/gps`, {
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

    /*
       Patch the toggled media into the caches that hold it rather than
       invalidating and refetching - see the matching note in CategoriesContext
       for why reference stability matters here.

       Note this deliberately does not chase `Category.teaser`, which is also a
       Media. Its `isFavorite` is never rendered - the card shows the category's
       own flag - so rewriting every category list on each media toggle would be
       churn for a value nothing reads.
    */
    const applyMediaIsFavorite = (id: Uuid, isFavorite: boolean) => {
        const patchOne = (media: Media[]) => patchById(media, id, { isFavorite });

        queryClient.setQueryData<Media>(["media", id], prev =>
            prev ? { ...prev, isFavorite } : prev
        );

        queryClient.setQueryData<InfiniteData<Media[] | undefined>>(["media", "random"], prev => {
            if (!prev) {
                return prev;
            }

            let changed = false;

            const pages = prev.pages.map(page => {
                if (!page) {
                    return page;
                }

                const next = patchOne(page);

                if (next === page) {
                    return page;
                }

                changed = true;

                return next;
            });

            return changed ? { ...prev, pages } : prev;
        });

        // the media list held for each category
        queryClient.setQueriesData<Media[]>(
            {
                predicate: query =>
                    query.queryKey[0] === "categories" && query.queryKey[2] === "media"
            },
            prev => (prev ? patchOne(prev) : prev)
        );
    };

    const setIsFavoriteMutation = useMutation(() => ({
        mutationFn: (isFavoriteReq: IsFavoriteRequest<Media>) => postIsFavorite(isFavoriteReq),
        onSuccess: (response, request) => {
            applyMediaIsFavorite(request.item.id, request.isFavorite);

            // the value is now on screen, so let its heart celebrate
            pulseFavorite(request.item.id);
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
        onSettled: async () => {
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
