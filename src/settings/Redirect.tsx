import { useNavigate } from "@solidjs/router";
import { Component } from "solid-js";

import { settingsCategories } from "./_routes";

const Settings: Component = () => {
    const navigate = useNavigate();

    navigate(settingsCategories.absolutePath, { replace: true });

    return <></>;
};

export default Settings;
