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

export interface MediaService {
    mediaQuery: (id: Accessor<Uuid>) => UseQueryResult<Media | undefined, Error>;
    metadataQuery: (id: Accessor<Uuid>) => UseQueryResult<object, Error>;
    commentsQuery: (id: Accessor<Uuid>) => UseQueryResult<Comment[], Error>;
    gpsQuery: (id: Accessor<Uuid>) => UseQueryResult<GpsDetail, Error>;
    randomMediaQuery: (
        count: number
    ) => UseInfiniteQueryResult<InfiniteData<Media[] | undefined>, Error>;
    addCommentMutation: UseMutationResult<void, Error, AddCommentRequest, unknown>;
}

const MediaContext = createContext<MediaService>();

export const MediaProvider: ParentComponent = props => {
    const [authContext, { getToken }] = useAuthContext();
    const queryClient = useQueryClient();

    const fetchMedia = async (id?: Uuid) =>
        id
            ? runWithAccessToken(getToken, accessToken =>
                  queryApi<Media>(accessToken, `media/${id}`)
              )
            : undefined;

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
                c.created = new Date(c.created);
            }

            return comments;
        });

    const fetchGps = async (id: Uuid) =>
        runWithAccessToken(getToken, accessToken =>
            queryApi<GpsDetail>(accessToken, `media/${id}/gps`)
        );

    const postComment = async (req: AddCommentRequest) => {
        runWithAccessToken(getToken, accessToken =>
            postApi(accessToken, `media/${req.mediaId}/comments`, { body: req.comment })
        );
    };

    // todo:
    // patchApi(`media/${mediaId}/favorite`, { mediaId, isFavorite });
    // postApi(`media/${mediaId}/comments`, { comment });
    // patchApi(`media/${mediaId}/gps`, gps);

    const randomMediaQuery = (count: number) =>
        useInfiniteQuery(() => ({
            queryKey: ["media", "random"],
            queryFn: data => fetchRandom(count),
            enabled: authContext.isLoggedIn,
            staleTime: Infinity,
            initialPageParam: 0,
            getNextPageParam: () => 0
        }));

    const mediaQuery = (id: Accessor<Uuid | undefined>) =>
        useQuery(() => ({
            queryKey: ["media", id()],
            queryFn: () => fetchMedia(id()),
            enabled: authContext.isLoggedIn,
            staleTime: 15 * 60 * 1000
        }));

    const metadataQuery = (id: Accessor<Uuid>) =>
        useQuery(() => ({
            queryKey: ["media", id(), "metadata"],
            queryFn: () => fetchMetadata(id()),
            enabled: authContext.isLoggedIn,
            staleTime: 15 * 60 * 1000
        }));

    const commentsQuery = (id: Accessor<Uuid>) =>
        useQuery(() => ({
            queryKey: ["media", id(), "comments"],
            queryFn: () => fetchComments(id()),
            enabled: authContext.isLoggedIn
        }));

    const gpsQuery = (id: Accessor<Uuid>) =>
        useQuery(() => ({
            queryKey: ["media", id(), "gps"],
            queryFn: () => fetchGps(id()),
            enabled: authContext.isLoggedIn,
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

    return (
        <MediaContext.Provider
            value={{
                mediaQuery,
                metadataQuery,
                commentsQuery,
                gpsQuery,
                randomMediaQuery,
                addCommentMutation
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
