/*
   An API failure that still knows what went wrong.

   The previous `new Error("Error invoking remote API call.")` discarded the
   status, which meant nothing downstream could tell a 401 from a 500: retry
   policy could not skip failures that will never succeed, and any error UI
   could only say "something broke".
*/
export class ApiError extends Error {
    constructor(
        readonly status: number,
        readonly statusText: string,
        readonly url: string
    ) {
        super(`API request failed: ${status} ${statusText || "(no status text)"} - ${url}`);

        this.name = "ApiError";
    }

    // the caller is not allowed in, and repeating the request will not help
    get isAuthError() {
        return this.status === 401 || this.status === 403;
    }

    // 4xx generally reflects the request itself, so it will not fix itself
    get isClientError() {
        return this.status >= 400 && this.status < 500;
    }
}

/*
   A short, human sentence for an unknown thrown value. Everything that renders
   an error goes through here so the wording stays consistent, and so a raw
   internal message is never shown to a user.
*/
export const describeError = (error: unknown): string => {
    if (error instanceof ApiError) {
        if (error.isAuthError) {
            return "You do not have permission to view this. Signing in again may help.";
        }

        if (error.status === 404) {
            return "We could not find what you were looking for.";
        }

        if (error.status >= 500) {
            return "The server ran into a problem. This is usually temporary.";
        }

        return `The request could not be completed (error ${error.status}).`;
    }

    // a fetch that never reached the server throws TypeError
    if (error instanceof TypeError) {
        return "Could not reach the server. Please check your connection.";
    }

    return "Something went wrong.";
};
