import { ParentComponent } from "solid-js";

import Toolbar from "./components/Toolbar";
import Layout from "../_components/layout/Layout";
import BrandHeader from "../_components/brand/BrandHeader";

const AboutLayout: ParentComponent = props => {
    return (
        <Layout toolbar={<Toolbar />}>
            <BrandHeader showVersion />

            <div class="mx-4 md:mx-10%">{props.children}</div>
        </Layout>
    );
};

export default AboutLayout;
