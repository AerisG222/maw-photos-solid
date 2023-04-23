import { ParentComponent, createEffect } from "solid-js";
import { useIsRouting, useNavigate } from '@solidjs/router';

import { isLoggedIn } from '../../auth/auth';

const AuthGuard: ParentComponent = (props) => {
    const isRouting = useIsRouting();
    const navigate = useNavigate();

    createEffect(() => {
        if(isRouting()) {
            return;
        }

        console.log('authgard check!');

        if(!isLoggedIn()) {
            navigate("/login", { replace: true})
        }
    })

    return <>{props.children}</>;
};

export default AuthGuard;
