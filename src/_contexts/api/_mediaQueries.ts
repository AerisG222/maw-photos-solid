import { infiniteQueryOptions, queryOptions } from "@tanstack/solid-query";

import { queryApi, runWithAccessToken } from "./_shared";
import { queryKeys } from "./_queryKeys";
import { GetToken } from "./_configQueries";
import { Media } from "../../_models/Media";
import { CommentDto, mapComment } from "../../_models/Comment";
import { DetectedFace } from "../../_models/DetectedFace";
import { GpsDetail } from "../../_models/GpsDetail";
import { MediaMetadata } from "../../_models/MediaMetadata";
import { Uuid } from "../../_models/Uuid";

/*
   The query definitions for media: key, fetch and freshness together, shared
   by the context that screens read through and by the route loaders that start
   the same queries before a screen exists. One definition, so a loader warms
   exactly the cache entry the screen then reads, and trusts it for exactly as
   long.
*/

export const fetchRandom = async (getToken: GetToken, count: number) =>
    runWithAccessToken(getToken, accessToken =>
        queryApi<Media[]>(accessToken, `media/random/${count}`)
    );

/*
   An unending stack: every page is a fresh random draw, so a page is never
   stale - re-fetching one would reshuffle what is already on screen.
*/
export const randomMediaQueryOptions = (getToken: GetToken, count: number) =>
    infiniteQueryOptions({
        queryKey: queryKeys.media.random(),
        queryFn: () => fetchRandom(getToken, count),
        staleTime: Infinity,
        initialPageParam: 0,
        getNextPageParam: (_lastPage: Media[] | undefined, pages: unknown[]) => pages.length,
        maxPages: 120
    });

export const fetchMetadata = async (getToken: GetToken, id: Uuid) =>
    runWithAccessToken(getToken, accessToken =>
        queryApi<MediaMetadata>(accessToken, `media/${id}/metadata`)
    );

export const fetchComments = async (getToken: GetToken, id: Uuid) =>
    runWithAccessToken(getToken, async accessToken => {
        const comments = await queryApi<CommentDto[]>(accessToken, `media/${id}/comments`);

        return comments.map(mapComment);
    });

export const fetchGps = async (getToken: GetToken, id: Uuid) =>
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

/*
   The faces detected in one media item, for the highlight overlay.

   This is the one call in the app that has no counterpart in maw-media yet:
   media.face holds the boxes, but nothing reads them back out. The shape
   below mirrors that table, so exposing it should be a read route over the
   existing rows rather than a new model - and if it lands under a different
   name, this function is the only thing that has to change.
*/
export const fetchFaces = async (getToken: GetToken, id: Uuid) =>
    runWithAccessToken(getToken, accessToken =>
        queryApi<DetectedFace[]>(accessToken, `media/${id}/faces`)
    );

export const fetchMediaRoles = async (getToken: GetToken, id: Uuid) =>
    runWithAccessToken(getToken, accessToken =>
        queryApi<string[]>(accessToken, `media/${id}/roles`)
    );

// the questions asked about one photo - the inspector's cards, and the face overlay

export const metadataQueryOptions = (getToken: GetToken, id: Uuid) =>
    queryOptions({
        queryKey: queryKeys.media.metadata(id),
        queryFn: () => fetchMetadata(getToken, id),
        staleTime: 15 * 60 * 1000
    });

// the client's default freshness: a comment can be added by anybody at any time
export const commentsQueryOptions = (getToken: GetToken, id: Uuid) =>
    queryOptions({
        queryKey: queryKeys.media.comments(id),
        queryFn: () => fetchComments(getToken, id)
    });

export const gpsQueryOptions = (getToken: GetToken, id: Uuid) =>
    queryOptions({
        queryKey: queryKeys.media.gps(id),
        queryFn: () => fetchGps(getToken, id),
        staleTime: 15 * 60 * 1000
    });

export const facesQueryOptions = (getToken: GetToken, id: Uuid) =>
    queryOptions({
        queryKey: queryKeys.media.faces(id),
        queryFn: () => fetchFaces(getToken, id),
        staleTime: 30 * 60 * 1000
    });

export const mediaRolesQueryOptions = (getToken: GetToken, id: Uuid) =>
    queryOptions({
        queryKey: queryKeys.media.roles(id),
        queryFn: () => fetchMediaRoles(getToken, id),
        staleTime: 15 * 60 * 1000
    });
