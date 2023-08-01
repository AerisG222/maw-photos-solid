import { Component, createEffect } from "solid-js";

import { initiateAuthInline, initiateAuthPopup, isLoggedIn } from "./auth";

import SuccessfulLoginMonitor from "./SuccessfulLoginMonitor";

const Login: Component = () => {
    createEffect(() => {
        if(!isLoggedIn()) {
            initiateAuthPopup();
        }
    });

    return (
        <>
            <SuccessfulLoginMonitor />

            <div class="text-center">
                <img src="/icon-192x192.png" class="inline mt-12 mb-8" />

                <p>Welcome to photos.mikeandwan.us</p>

                <p>
                    Please login via the popup window (and make sure the popup was not
                    blocked).
                </p>

                <p>Otherwise, please click the button below to initiate the login.</p>

                <button
                    class="btn btn-primary btn-outline gap-2 mt-8"
                    type="submit"
                    onClick={async () => await initiateAuthInline()}
                >
                    <span class="i-ic-round-security" /> Login
                </button>
            </div>
        </>
    );
};

export default Login;
