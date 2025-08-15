const buildAbsoluteUrl = (relativeUrl: string): string =>
    `${import.meta.env.VITE_API_URI}/${relativeUrl}`;

export const queryMawApi = async <T>(accessToken: string, relativeUrl: string, content?: any) => {
    relativeUrl = content ? `${relativeUrl}?${getQueryParams(content)}` : relativeUrl;

    var result = await callMawApi("GET", relativeUrl, undefined, accessToken);

    return result ? (result.json() as T) : undefined;
};

export const patchMawApi = (accessToken: string, relativeUrl: string, content: any) =>
    callMawApi("PATCH", relativeUrl, content, accessToken);

export const postMawApi = (accessToken: string, relativeUrl: string, content: any) =>
    callMawApi("POST", relativeUrl, content, accessToken);

const getQueryParams = (content: any) => new URLSearchParams(content).toString();

const callMawApi = async (method: string, relativeUrl: string, content: any, accessToken: string) => {
    const response = fetch(buildAbsoluteUrl(relativeUrl), {
        method: method,
        mode: "cors",
        cache: "no-cache",
        body: content ? JSON.stringify(content) : null,
        headers: {
            "Authorization": `Bearer ${accessToken}`,
            "Content-Type": "application/json"
        },
        referrerPolicy: "no-referrer"
    }).catch(err => console.log(err));

    return (await response) ?? undefined;
};
