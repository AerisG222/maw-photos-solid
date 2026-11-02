/*
   Keeps the cookie media files load with alive while somebody is using the app, and
   only then.

   An <img> can not carry a bearer token and can not ask for a new credential when
   its own has run out, so the cookie has to be renewed ahead of time. It is renewed
   at the halfway point of its life, if there has been activity since the last
   renewal. When there has not, nothing is scheduled and it is left to expire: a tab
   somebody walked away from does not keep itself signed in. Every renewal also goes
   to Auth0 for a new token, which would count as session activity there as well.

   Activity after the halfway point renews at once, which is also what brings the
   cookie back when somebody returns to a tab whose cookie has already expired.
*/
export interface AssetSessionDeps {
    // fresh skips Auth0's token cache: the cookie can not outlive the token it was
    // made from, so renewing early with the same token would not extend anything
    getToken: (fresh: boolean) => Promise<string | undefined>;
    // answers with the life of the new cookie, in seconds
    createSession: (accessToken: string) => Promise<number>;
    onSessionEnded: () => void;
}

export interface AssetSession {
    start: () => Promise<void>;
    stop: () => Promise<void>;
}

// also the floor on how soon a renewal can follow another, so a very short lived
// token can not turn every pointer movement into a request
const RETRY_DELAY_MS = 30_000;

const INPUT_EVENTS = ["pointerdown", "pointermove", "keydown", "wheel", "touchstart"];

// what Auth0 answers when only signing in again can produce a token
const SESSION_ENDED_ERRORS = ["login_required", "consent_required", "interaction_required"];

const isSessionEnded = (error: unknown) =>
    typeof error === "object" &&
    error !== null &&
    "error" in error &&
    SESSION_ENDED_ERRORS.includes(String(error.error));

export const createAssetSession = (deps: AssetSessionDeps): AssetSession => {
    let running = false;
    let active = false;
    let renewAt = 0;
    let retryAt = 0;
    let timer: ReturnType<typeof setTimeout> | undefined;
    let inFlight: Promise<void> | undefined;

    const renew = (fresh: boolean) => {
        if (inFlight || !running || Date.now() < retryAt) {
            return inFlight ?? Promise.resolve();
        }

        inFlight = (async () => {
            try {
                const token = await deps.getToken(fresh);

                if (!token) {
                    throw new Error("no access token");
                }

                const lifetimeSeconds = await deps.createSession(token);
                const delay = Math.max((lifetimeSeconds * 1000) / 2, RETRY_DELAY_MS);

                active = false;
                retryAt = 0;
                renewAt = Date.now() + delay;

                clearTimeout(timer);
                timer = running ? setTimeout(onHalfway, delay) : undefined;
            } catch (error) {
                console.error("AssetSession: could not renew", error);

                retryAt = Date.now() + RETRY_DELAY_MS;

                // only a renewal: at startup the route guards decide this, and some
                // routes do not need anybody signed in
                if (fresh && isSessionEnded(error)) {
                    deps.onSessionEnded();
                }
            } finally {
                inFlight = undefined;
            }
        })();

        return inFlight;
    };

    const onHalfway = () => {
        if (active) {
            void renew(true);
        }
    };

    const onActivity = () => {
        active = true;

        if (Date.now() >= renewAt) {
            void renew(true);
        }
    };

    // passive viewing: a playing video, or a slideshow changing the picture.  the
    // video does not need checking for visibility, because it stops by itself and
    // somebody may well be listening to it from another tab
    const onImageLoad = () => {
        if (document.visibilityState === "visible") {
            onActivity();
        }
    };

    const onVisibilityChange = () => {
        if (document.visibilityState === "visible") {
            onActivity();
        }
    };

    const options = { capture: true, passive: true };

    return {
        start: async () => {
            running = true;

            for (const event of [...INPUT_EVENTS, "timeupdate"]) {
                document.addEventListener(event, onActivity, options);
            }

            document.addEventListener("load", onImageLoad, options);
            document.addEventListener("visibilitychange", onVisibilityChange);

            await renew(false);
        },
        // waits out a renewal in flight, whose cookie would otherwise arrive after
        // the caller has cleared it
        stop: async () => {
            running = false;

            clearTimeout(timer);

            for (const event of [...INPUT_EVENTS, "timeupdate"]) {
                document.removeEventListener(event, onActivity, options);
            }

            document.removeEventListener("load", onImageLoad, options);
            document.removeEventListener("visibilitychange", onVisibilityChange);

            await inFlight;
        }
    };
};
