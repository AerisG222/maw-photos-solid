import { Accessor, createContext, ParentComponent, useContext } from "solid-js";
import { useInfiniteQuery, useQuery, UseQueryResult } from "@tanstack/solid-query";

import { Comment } from "../../_models/Comment";
import { useAuthContext } from "../AuthContext";
import { queryApi, runWithAccessToken } from "./_shared";
import { Media } from "../../_models/Media";
import { GpsDetail } from "../../_models/GpsDetail";

export type MediaService = {
    mediaQuery: (id: Accessor<Uuid>) => UseQueryResult<Media, Error>;
    metadataQuery: (id: Accessor<Uuid>) => UseQueryResult<object, Error>;
    commentsQuery: (id: Accessor<Uuid>) => UseQueryResult<Comment[], Error>;
    gpsQuery: (id: Accessor<Uuid>) => UseQueryResult<GpsDetail, Error>;
};

const MediaContext = createContext<MediaService>();

export const MediaProvider: ParentComponent = props => {
    const [authContext, { getToken }] = useAuthContext();

    const fetchMedia = async (id: Uuid) =>
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
                c.created = new Date(c.created);
            }

            return comments;
        });

    const fetchGps = async (id: Uuid) =>
        runWithAccessToken(getToken, accessToken =>
            queryApi<GpsDetail>(accessToken, `media/${id}/gps`)
        );

    // todo:
    // patchApi(`media/${mediaId}/favorite`, { mediaId, isFavorite });
    // postApi(`media/${mediaId}/comments`, { comment });
    // patchApi(`media/${mediaId}/gps`, gps);

    // const randomQuery = (count: number) =>
    //     useInfiniteQuery(() => ({
    //         queryKey: ["media", "random"],
    //         queryFn: ({pageParam}) => fetchRandom(count),
    //         enabled: authContext.isLoggedIn,
    //         staleTime: 15 * 60 * 1000
    //     }));

    const mediaQuery = (id: Accessor<Uuid>) =>
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

    return (
        <MediaContext.Provider
            value={{
                mediaQuery,
                metadataQuery,
                commentsQuery,
                gpsQuery
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
