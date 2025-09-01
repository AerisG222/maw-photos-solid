import { Component } from "solid-js";
import { useNavigate } from "@solidjs/router";

const Redirect: Component = () => {
    const navigate = useNavigate();

    navigate("/random/grid", { replace: true });

    return <></>;
};

export default Redirect;
