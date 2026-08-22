import { Uuid } from "../../_models/Uuid";
import { ApiError } from "./ApiError";

const API_VERSION = "v1";

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
        throw new ApiError(response.status, response.statusText, relativeUrl);
    }

    return response;
};
