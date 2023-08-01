import { ParentComponent, children, createEffect } from "solid-js";
import { useIsRouting, useLocation, useNavigate } from '@solidjs/router';

import { isLoggedIn, setRedirectUrl } from '../../auth/auth';

const AuthGuard: ParentComponent = (props) => {
    const location = useLocation();
    const isRouting = useIsRouting();
    const navigate = useNavigate();
    const c = children(() => props.children);

    createEffect(() => {
        if(isRouting()) {
            return;
        }

        if(!isLoggedIn()) {
            setRedirectUrl(`${location.pathname}${location.search}`);
            navigate("/login", { replace: true });
        }
    });

    return (
        <>
            {c()}
        </>
    );
};

export default AuthGuard;
