import { Component } from "solid-js";
import { Outlet } from "@tanstack/solid-router";

import Toolbar from "./components/Toolbar";
import Layout from "../_components/layout/Layout";
import BrandHeader from "../_components/brand/BrandHeader";

const AboutLayout: Component = () => {
    return (
        <Layout toolbar={<Toolbar />}>
            <BrandHeader showVersion />

            {/* prose: the page runs the full width, but a line of text should not */}
            <div class="max-w-3xl">
                <Outlet />
            </div>
        </Layout>
    );
};

export default AboutLayout;
