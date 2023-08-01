import { Component, createEffect } from "solid-js";
import { useNavigate } from "@solidjs/router";

import { isLoggedIn, redirectUrl } from "./auth";
import { useCategoryContext } from "../contexts/CategoryContext";

const SuccessfulLoginMonitor: Component = () => {
    const [categoryContext] = useCategoryContext();
    const navigate = useNavigate();

    createEffect(() => {
        if(isLoggedIn() && categoryContext.initialized) {
            redirectUrl() ?
                navigate(redirectUrl()) :
                navigate("/");
        }
    });

    return <></>;
};

export default SuccessfulLoginMonitor;
