import { Component, Show } from "solid-js";
import { Link } from "@tanstack/solid-router";

import { useAuthContext } from "../_contexts/AuthContext";

import BrandHeader from "../_components/brand/BrandHeader";

const Logout: Component = () => {
    const [authContext, { logout }] = useAuthContext();

    if (authContext.isLoggedIn) {
        void logout();
    }

    return (
        <>
            <div class="text-center">
                <BrandHeader />

                <Show when={!authContext.isLoggedIn}>
                    <p class="font-bold mb-8">You have logged out!</p>
                </Show>

                <p>
                    If you would like to return photos.mikeandwan.us, please{" "}
                    <Link to="/auth/login" class="link text-secondary">
                        login
                    </Link>
                    .
                </p>
            </div>
        </>
    );
};

export default Logout;
