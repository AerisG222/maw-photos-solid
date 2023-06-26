import { ParentComponent, children, createEffect } from "solid-js";
import { useIsRouting, useNavigate } from '@solidjs/router';

import { isLoggedIn } from '../../auth/auth';

const AuthGuard: ParentComponent = (props) => {
    const isRouting = useIsRouting();
    const navigate = useNavigate();
    const c = children(() => props.children);

    createEffect(() => {
        if(isRouting()) {
            return;
        }

        if(!isLoggedIn()) {
            navigate("/login", { replace: true})
        }
    })

    return (
        <>
            {c()}
        </>
    );
};

export default AuthGuard;
