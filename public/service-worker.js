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
            const token = await requestTokenFromMainThread();
            const headers = new Headers(event.request.headers);

            headers.set("Authorization", "Bearer " + token);

            const modifiedRequestInit = {
                headers: headers,
                mode: "cors",
                credentials: "omit"
            };

            const modifiedRequest = new Request(event.request, modifiedRequestInit);

            try {
                return fetch(modifiedRequest);
            } catch (error) {
                console.error("sw: Error fetching resource:", error);
                return new Response("Error fetching resource", { status: 500 });
            }
        })()
    );
});

function requestTokenFromMainThread() {
    return new Promise(resolve => {
        const channel = new MessageChannel();

        channel.port1.onmessage = event => {
            resolve(event.data);
        };

        self.clients.matchAll().then(clients => {
            if (clients && clients.length) {
                clients[0].postMessage("REQUEST_TOKEN", [channel.port2]);
            }
        });
    });
}
