import { useNavigate } from "@solidjs/router";
import { Component, onMount } from "solid-js";

import { categories } from "../categories/_routes";

const Redirect: Component = () => {
    const navigate = useNavigate();

    onMount(() => {
        navigate(categories.absolutePath, { replace: true });
    });

    return <></>;
};

export default Redirect;
