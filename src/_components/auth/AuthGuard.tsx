import { ParentComponent, Show, children, createResource } from "solid-js";
import { useIsRouting, useLocation, useNavigate } from "@solidjs/router";

import { useAuthContext } from "../../_contexts/AuthContext";

const AuthGuard: ParentComponent = props => {
    const [authContext, { getToken }] = useAuthContext();
    const location = useLocation();
    const isRouting = useIsRouting();
    const navigate = useNavigate();
    const c = children(() => props.children);

    const [res] = createResource(async () => {
        if (isRouting()) {
            return true;
        }

        if (!authContext.isLoggedIn || !(await getToken())) {
            // todo: redirect to orig dest after login
            //setRedirectUrl(`${location.pathname}${location.search}`);
            navigate("/login", { replace: true });
            return false;
        }

        return true;
    });

    return <Show when={res.latest}>{c()}</Show>;
};

export default AuthGuard;
