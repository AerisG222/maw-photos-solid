import { useNavigate } from '@solidjs/router';
import { Component, onMount } from "solid-js";

const Redirect: Component = () => {
    const navigate = useNavigate();

    onMount(() => {
        navigate("/categories", { replace: true });
    });

    return (<></>);
};

export default Redirect;
