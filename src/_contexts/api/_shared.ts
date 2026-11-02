import { Uuid } from "../../_models/Uuid";
import { ApiError } from "./ApiError";

const API_VERSION = "v1";
const ASSET_SESSION_URL = "auth/asset-session";
const ASSET_SESSION_TIMEOUT_MS = 10_000;

const buildAbsoluteUrl = (relativeUrl: string): string =>
    `${import.meta.env.VITE_API_URI}/api/${API_VERSION}/${relativeUrl}`;

export const buildCategoryDownloadUrl = (id: Uuid): string =>
    buildAbsoluteUrl(`categories/${id}/download`);

const getQueryParams = (content: Record<string, string>) => new URLSearchParams(content).toString();

export const runWithAccessToken = async <T>(
    getToken: () => Promise<string | undefined>,
    func: (accessToken: string) => Promise<T>
) => {
    const accessToken = await getToken();

    if (accessToken) {
        return await func(accessToken);
    }

    throw new Error("Invalid access token!");
};

/*
   The only calls here that send credentials: the cookie these set and clear is what
   media files load with, and every other route takes the bearer token alone.
*/
export const createAssetSession = async (accessToken: string) => {
    const response = await fetch(buildAbsoluteUrl(ASSET_SESSION_URL), {
        method: "POST",
        mode: "cors",
        credentials: "include",
        cache: "no-cache",
        headers: { Authorization: `Bearer ${accessToken}` },
        referrerPolicy: "no-referrer",
        // the app waits for this before it renders, so it can not be left to hang
        signal: AbortSignal.timeout(ASSET_SESSION_TIMEOUT_MS)
    });

    if (!response.ok) {
        throw new ApiError(response.status, response.statusText, ASSET_SESSION_URL, undefined);
    }

    return ((await response.json()) as { expiresInSeconds: number }).expiresInSeconds;
};

export const deleteAssetSession = async () => {
    await fetch(buildAbsoluteUrl(ASSET_SESSION_URL), {
        method: "DELETE",
        mode: "cors",
        credentials: "include",
        cache: "no-cache",
        referrerPolicy: "no-referrer",
        signal: AbortSignal.timeout(ASSET_SESSION_TIMEOUT_MS)
    });
};

export const queryApi = async <T>(
    accessToken: string,
    relativeUrl: string,
    content?: Record<string, string>
) => {
    relativeUrl = content ? `${relativeUrl}?${getQueryParams(content)}` : relativeUrl;

    const response = await callApi("GET", relativeUrl, undefined, accessToken);

    return response.json() as T;
};

export const patchApi = (accessToken: string, relativeUrl: string, content: unknown) =>
    callApi("PATCH", relativeUrl, content, accessToken);

export const postApi = (accessToken: string, relativeUrl: string, content: unknown) =>
    callApi("POST", relativeUrl, content, accessToken);

export const putApi = (accessToken: string, relativeUrl: string, content: unknown) =>
    callApi("PUT", relativeUrl, content, accessToken);

export const deleteApi = (accessToken: string, relativeUrl: string) =>
    callApi("DELETE", relativeUrl, undefined, accessToken);

// best effort - an error body that cannot be read is no reason to lose the status
const readErrorBody = async (response: Response): Promise<unknown> => {
    let text: string;

    try {
        text = await response.text();
    } catch {
        return undefined;
    }

    if (!text) {
        return undefined;
    }

    try {
        return JSON.parse(text) as unknown;
    } catch {
        return text;
    }
};

const callApi = async (
    method: string,
    relativeUrl: string,
    content: unknown,
    accessToken: string
) => {
    const response = await fetch(buildAbsoluteUrl(relativeUrl), {
        method: method,
        mode: "cors",
        cache: "no-cache",
        body: content ? JSON.stringify(content) : null,
        headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json"
        },
        referrerPolicy: "no-referrer"
    });

    if (!response.ok) {
        throw new ApiError(
            response.status,
            response.statusText,
            relativeUrl,
            await readErrorBody(response)
        );
    }

    return response;
};
