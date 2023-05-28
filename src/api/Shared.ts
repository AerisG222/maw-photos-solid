import { accessToken } from '../auth/auth';

const buildAbsoluteUrl = (relativeUrl: string): string =>
    `${import.meta.env.VITE_API_URI}/${relativeUrl}`;

export const queryMawApi = async <T>(relativeUrl: string) =>
    (await callMawApi('GET', relativeUrl, undefined)).json() as T

export const patchMawApi = (relativeUrl: string, content: any) =>
    callMawApi('PATCH', relativeUrl, content);

export const postMawApi = (relativeUrl: string, content: any) =>
    callMawApi('POST', relativeUrl, content)

const callMawApi = async (method: string, relativeUrl: string, content: any) =>
    await fetch(
        buildAbsoluteUrl(relativeUrl),
        {
            method: method,
            mode: "cors",
            cache: "no-cache",
            body: content ? JSON.stringify(content) : null,
            headers: {
                "Authorization": `Bearer ${accessToken()}`,
                "Content-Type": 'application/json'
            },
            referrerPolicy: "no-referrer"
        }
    );
