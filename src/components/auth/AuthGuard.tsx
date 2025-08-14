import { ParentComponent, children, createEffect } from "solid-js";
import { useIsRouting, useLocation, useNavigate } from "@solidjs/router";
import { useAuthContext } from "../../contexts/AuthContext";

const AuthGuard: ParentComponent = props => {
    const [authContext] = useAuthContext();
    const location = useLocation();
    const isRouting = useIsRouting();
    const navigate = useNavigate();
    const c = children(() => props.children);

    createEffect(async () => {
        if (isRouting()) {
            return;
        }

        if (!authContext.isLoggedIn) {
            // todo: redirect to orig dest after login
            //setRedirectUrl(`${location.pathname}${location.search}`);
            navigate("/login", { replace: true });
        }
    });

    return <>{c()}</>;
};

export default AuthGuard;
