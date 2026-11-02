/*
   Removes the service worker that used to live here.

   It attached the access token to media requests. Those now carry a cookie (see
   _contexts/assetSession.ts), so nothing registers a worker any more - but a browser
   that has one keeps running it until it is told otherwise, and a worker left behind
   holds up images asking a page for a token that no page will answer.

   A browser only finds this file when somebody visits again, so it has to stay long
   after the last release that registered the old worker. Delete it and the path falls
   through to index.html, the update fails, and the old worker stays for good. nginx's
   worker-src 'self' has to stay with it.
*/
self.addEventListener("install", () => self.skipWaiting());

self.addEventListener("activate", event => {
    event.waitUntil(
        (async () => {
            await self.registration.unregister();

            // reloaded because a tab still running the old bundle never asks for the
            // cookie, so without its worker every image it had not loaded would fail
            const clients = await self.clients.matchAll({ type: "window" });

            await Promise.all(clients.map(client => client.navigate(client.url)));
        })()
    );
});
