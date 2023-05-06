import { createQuery, createMutation } from '@tanstack/solid-query';
import { accessToken } from '../auth/auth';

const buildAbsoluteUrl = (relativeUrl: string): string =>
    `${import.meta.env.VITE_API_URI}/${relativeUrl}`;

export const queryMawApi = <T>(relativeUrl: string) =>
    createQuery<T>(
        () => [relativeUrl],
        async () => {
            const response = callMawApi('GET', relativeUrl, undefined);
            return (await response).json();
        }
    );

export const patchMawApi = (relativeUrl: string, content: any) =>
    createMutation(
        () => callMawApi('PATCH', relativeUrl, content)
    );

export const postMawApi = (relativeUrl: string, content: any) =>
    createMutation(
        () => callMawApi('POST', relativeUrl, content)
    );

const callMawApi = async (method: string, relativeUrl: string, content: any) =>
    await fetch(
        buildAbsoluteUrl(relativeUrl),
        {
            method: method,
            body: content ? content : null,
            headers: {
                "Authorization": `Bearer ${accessToken()}`
            }
        }
    );
