import { ParentComponent, children, createEffect } from "solid-js";
import { useLocation, useNavigate } from "@solidjs/router";

import { useAuthContext } from "../../_contexts/AuthContext";
import { inactive } from "../../auth/_routes";

const AccountActivatedGuard: ParentComponent = props => {
    const [state] = useAuthContext();
    const navigate = useNavigate();
    const location = useLocation();

    const c = children(() => props.children);

    createEffect(() => {
        if (
            state.isLoggedIn &&
            state.accountStatus?.status === "inactive" &&
            location.pathname !== inactive.absolutePath
        ) {
            navigate(inactive.absolutePath);
        }
    });

    return <>{c()}</>;
};

export default AccountActivatedGuard;
