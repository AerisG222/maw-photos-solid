import { Component } from "solid-js";
import { useNavigate } from "../_router/compat";

const Redirect: Component = () => {
    const navigate = useNavigate();

    navigate("/random/grid", { replace: true });

    return <></>;
};

export default Redirect;
