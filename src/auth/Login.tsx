import { Component, Show } from "solid-js";

import { useAuthContext } from "../_contexts/AuthContext";

const Login: Component = () => {
    const [state, { login }] = useAuthContext();

    return (
        <>
            <div>
                <div class="font-brand text-6xl text-center mt-4 md:my-8">
                    <img src="/icon.svg" width="156" height="156" class="inline mb-4" />

                    <h2 class="text-primary">
                        <a href="https://www.mikeandwan.us">mikeandwan.us</a>
                    </h2>
                    <h2 class="text-secondary">Photos</h2>
                </div>

                <div class="text-center">
                    <p class="mb-4">Welcome to photos.mikeandwan.us!</p>

                    <Show when={!state.isLoggedIn}>
                        <p>Please login first to use the application.</p>

                        <button
                            class="btn btn-primary btn-outline gap-2 mt-8"
                            type="submit"
                            onClick={login}
                        >
                            <span class="icon-[ic--round-security]" /> Login
                        </button>
                    </Show>

                    <Show when={state.isLoggedIn}>
                        <p>You are already logged in.</p>
                        <p>Please use the navigation on the left to start browsing.</p>
                    </Show>
                </div>
            </div>
        </>
    );
};

export default Login;
