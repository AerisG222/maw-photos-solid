import { queryApi, runWithAccessToken } from "./_shared";
import { queryKeys } from "./_queryKeys";
import { CategoryDto, mapCategory } from "../../_models/Category";
import { Media } from "../../_models/Media";
import { GpsDetail } from "../../_models/GpsDetail";
import { Uuid } from "../../_models/Uuid";
import { AccountStatus } from "../../_models/AccountStatus";

export type GetToken = () => Promise<string | undefined>;

/*
   The queries a route asks for before its screen exists - in a loader, to start
   fetching while the page's code is still arriving, or in a guard deciding
   whether to let somebody in at all.

   Shared with the contexts rather than copied, and whole: key, fetch and
   staleTime together. A loader that warmed the cache under its own staleTime
   would have the screen behind it refetch what it had only just fetched, and
   one under its own key would warm nothing anybody reads.
*/
export const categoriesForYearQueryOptions = (getToken: GetToken, year: number) => ({
    queryKey: queryKeys.categories.forYear(year),
    queryFn: () =>
        runWithAccessToken(getToken, async accessToken => {
            const categories = await queryApi<CategoryDto[]>(
                accessToken,
                `categories/years/${year}`
            );

            return { year, categories: categories.map(mapCategory) };
        }),
    staleTime: 1 * 60 * 1000
});

export const categoryQueryOptions = (getToken: GetToken, id: Uuid) => ({
    queryKey: queryKeys.categories.detail(id),
    queryFn: () =>
        runWithAccessToken(getToken, async accessToken => {
            const category = await queryApi<CategoryDto>(accessToken, `categories/${id}`);

            return mapCategory(category);
        }),
    staleTime: 5 * 60 * 1000
});

export const categoryMediaQueryOptions = (getToken: GetToken, id: Uuid) => ({
    queryKey: queryKeys.categories.media(id),
    queryFn: () =>
        runWithAccessToken(getToken, accessToken =>
            queryApi<Media[]>(accessToken, `categories/${id}/media`)
        ),
    staleTime: 5 * 60 * 1000
});

export const categoryMediaGpsQueryOptions = (getToken: GetToken, id: Uuid) => ({
    queryKey: queryKeys.categories.gps(id),
    queryFn: () =>
        runWithAccessToken(getToken, accessToken =>
            queryApi<GpsDetail[]>(accessToken, `categories/${id}/gps`)
        ),
    staleTime: 5 * 60 * 1000
});

export const accountStatusQueryOptions = (getToken: GetToken) => ({
    queryKey: queryKeys.auth.accountStatus(),
    queryFn: () =>
        runWithAccessToken(getToken, accessToken =>
            queryApi<AccountStatus>(accessToken, "auth/account-status")
        ),
    staleTime: 5 * 60 * 1000
});
