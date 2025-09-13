import { useNavigate } from "@solidjs/router";
import { Component } from "solid-js";

import { aboutHelp } from "./_routes";

const AboutRedirect: Component = () => {
    const navigate = useNavigate();

    navigate(aboutHelp.absolutePath, { replace: true });

    return <></>;
};

export default AboutRedirect;
