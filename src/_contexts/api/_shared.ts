const buildAbsoluteUrl = (relativeUrl: string): string =>
    `${import.meta.env.VITE_API_URI}/${relativeUrl}`;

export const buildCategoryDownloadUrl = (id: Uuid): string =>
    buildAbsoluteUrl(`categories/${id}/download`);

const getQueryParams = (content: any) => new URLSearchParams(content).toString();

export const runWithAccessToken = async <T>(getToken: () => Promise<string | undefined>, func: (accessToken: string) => Promise<T>) => {
    var accessToken = await getToken();

    if (accessToken) {
        return await func(accessToken);
    }

    throw new Error("Invalid access token!");
}

export const queryApi = async <T>(accessToken: string, relativeUrl: string, content?: any) => {
    relativeUrl = content ? `${relativeUrl}?${getQueryParams(content)}` : relativeUrl;

    var response = await callApi("GET", relativeUrl, undefined, accessToken);

    return response.json() as T;
};

export const patchApi = (accessToken: string, relativeUrl: string, content: any) =>
    callApi("PATCH", relativeUrl, content, accessToken);

export const postApi = (accessToken: string, relativeUrl: string, content: any) =>
    callApi("POST", relativeUrl, content, accessToken);

const callApi = async (method: string, relativeUrl: string, content: any, accessToken: string) => {
    const response = await fetch(buildAbsoluteUrl(relativeUrl), {
        method: method,
        mode: "cors",
        cache: "no-cache",
        body: content ? JSON.stringify(content) : null,
        headers: {
            "Authorization": `Bearer ${accessToken}`,
            "Content-Type": "application/json"
        },
        referrerPolicy: "no-referrer"
    });

    if (!response.ok) {
        throw new Error('Error invoking remote API call.');
    }

    return response;
};
