import { Component, Show } from "solid-js";
import { A } from "@solidjs/router";

import { useAuthContext } from "../_contexts/AuthContext";
import { loginPage } from "./_routes";

import BrandHeader from "./components/BrandHeader";

const Logout: Component = () => {
    const [authContext, { logout }] = useAuthContext();

    if (authContext.isLoggedIn) {
        logout();
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
                    <A href={loginPage.absolutePath} class="link text-secondary">
                        login
                    </A>
                    .
                </p>
            </div>
        </>
    );
};

export default Logout;
