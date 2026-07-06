self.addEventListener("install", event => {
    // Skip the 'waiting' lifecycle phase, to go directly from 'installed' to 'activated', even if
    // there are still previous incarnations of this service worker registration active.
    console.info("sw: install");
    event.waitUntil(self.skipWaiting());
});

self.addEventListener("activate", async event => {
    console.info("sw: activate");
    // Claim any clients immediately, so that the page will be under SW control without reloading.
    event.waitUntil(self.clients.claim());
});

// The access token is a short-lived JWT shared by every media request, so cache it in the worker
// and coalesce concurrent lookups instead of round-tripping to the main thread for each image.
let cachedToken = null;
let cachedTokenExp = 0; // epoch ms
let inFlightTokenRequest = null;

const TOKEN_SKEW_MS = 30000; // refresh slightly before the token actually expires
const TOKEN_TIMEOUT_MS = 5000; // give up if no client answers, so requests don't hang forever

self.addEventListener("fetch", function (event) {
    const url = event.request.url.toLowerCase();

    // make sure request is for media assets on *our* site
    if (
        !url.includes("/assets/") ||
        !url.includes("media.mikeandwan.us") ||
        event.request.headers.has("Authorization")
    ) {
        return;
    }

    event.respondWith(
        (async function () {
            let request = event.request;

            try {
                const token = await getToken();
                const headers = new Headers(event.request.headers);

                headers.set("Authorization", "Bearer " + token);

                request = new Request(event.request, {
                    headers: headers,
                    mode: "cors",
                    credentials: "omit"
                });
            } catch (error) {
                // Couldn't obtain a token (no client / timeout / auth failure). Fall back to the
                // original request rather than hanging or sending "Bearer undefined".
                console.error("sw: Error obtaining token:", error);
            }

            try {
                return await fetch(request);
            } catch (error) {
                console.error("sw: Error fetching resource:", error);
                return new Response("Error fetching resource", { status: 500 });
            }
        })()
    );
});

function getToken() {
    const now = Date.now();

    if (cachedToken && now < cachedTokenExp - TOKEN_SKEW_MS) {
        return Promise.resolve(cachedToken);
    }

    if (!inFlightTokenRequest) {
        inFlightTokenRequest = requestTokenFromMainThread()
            .then(token => {
                if (!token) {
                    throw new Error("sw: received empty token");
                }

                cachedToken = token;
                cachedTokenExp = decodeTokenExpiry(token) || Date.now() + 60000;

                return token;
            })
            .finally(() => {
                inFlightTokenRequest = null;
            });
    }

    return inFlightTokenRequest;
}

function decodeTokenExpiry(token) {
    try {
        const payload = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
        const exp = JSON.parse(atob(payload)).exp;

        return typeof exp === "number" ? exp * 1000 : 0;
    } catch {
        return 0;
    }
}

function requestTokenFromMainThread() {
    return new Promise((resolve, reject) => {
        const channel = new MessageChannel();
        const timer = setTimeout(
            () => reject(new Error("sw: token request timed out")),
            TOKEN_TIMEOUT_MS
        );

        channel.port1.onmessage = event => {
            clearTimeout(timer);
            resolve(event.data);
        };

        self.clients.matchAll({ type: "window" }).then(clients => {
            if (!clients.length) {
                clearTimeout(timer);
                reject(new Error("sw: no client available to provide token"));
                return;
            }

            clients[0].postMessage("REQUEST_TOKEN", [channel.port2]);
        });
    });
}
