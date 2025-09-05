if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
        navigator.serviceWorker
            .register("/service-worker.js")
            .then(registration => {
                console.info(
                    "ServiceWorker registration successful with scope: ",
                    registration.scope
                );
                return registration;
            })
            .catch(error => {
                console.error("ServiceWorker registration failed: ", error);
            });
    });
}
