import { useNavigate } from "@solidjs/router";
import { Component, onMount } from "solid-js";

import { loginPage } from "../auth/_routes";
import { categories } from "../categories/_routes";
import { useAuthContext } from "../_contexts/AuthContext";

const Redirect: Component = () => {
    const [authContext] = useAuthContext();
    const navigate = useNavigate();

    onMount(() => {
        if (!authContext.isLoggedIn) {
            navigate(loginPage.absolutePath, { replace: true });
        } else {
            navigate(categories.absolutePath, { replace: true });
        }
    });

    return <></>;
};

export default Redirect;
