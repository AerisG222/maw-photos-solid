import { ParentComponent } from "solid-js";

import AuthGuard from "../_components/auth/AuthGuard";

const Categories: ParentComponent = props => {
    return <AuthGuard>{props.children}</AuthGuard>;
};

export default Categories;
