import { ParentComponent } from "solid-js";

import AuthGuard from "../_components/auth/AuthGuard";

const People: ParentComponent = props => {
    return <AuthGuard>{props.children}</AuthGuard>;
};

export default People;
