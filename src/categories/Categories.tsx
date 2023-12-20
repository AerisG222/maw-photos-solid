import { ParentComponent } from "solid-js";

import AuthGuard from "../components/auth/AuthGuard";

const Categories: ParentComponent = (props) => {
    return (
        <AuthGuard>
            { props.children }
        </AuthGuard>
    );
};

export default Categories;
