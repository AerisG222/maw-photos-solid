import { Component } from "solid-js";

import { useAuthContext } from "../contexts/AuthContext";

const Login: Component = () => {
    const [authState, { login }] = useAuthContext();

    if (!authState.isLoggedIn) {
        login();
    }

    return (
        <>
            <div class="text-center">
                <img src="/icon-192x192.png" class="inline mt-12 mb-8" />

                <p>Welcome to photos.mikeandwan.us</p>

                <p>Please login via the popup window (and make sure the popup was not blocked).</p>

                <p>Otherwise, please click the button below to initiate the login.</p>

                <button
                    class="btn btn-primary btn-outline gap-2 mt-8"
                    type="submit"
                    onClick={async () => login()}
                >
                    <span class="icon-[ic--round-security]" /> Login
                </button>
            </div>
        </>
    );
};

export default Login;
