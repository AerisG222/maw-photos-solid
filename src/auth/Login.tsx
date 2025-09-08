import { Component, Show } from "solid-js";

import { useAuthContext } from "../_contexts/AuthContext";

import BrandHeader from "./components/BrandHeader";

const Login: Component = () => {
    const [state, { login }] = useAuthContext();

    return (
        <>
            <div class="text-center">
                <BrandHeader />

                <p class="mb-4">Welcome to photos.mikeandwan.us!</p>

                <Show when={!state.isLoggedIn}>
                    <p>Please login first to use the application.</p>

                    <button
                        class="btn btn-primary btn-outline gap-2 mt-8"
                        type="submit"
                        onClick={() => login()}
                    >
                        <span class="icon-[ic--round-security]" /> Login
                    </button>
                </Show>

                <Show when={state.isLoggedIn}>
                    <p>You are already logged in.</p>
                    <p>Please use the navigation on the left to start browsing.</p>
                </Show>
            </div>
        </>
    );
};

export default Login;
