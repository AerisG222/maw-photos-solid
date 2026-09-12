import { ParentComponent, Show, createResource } from "solid-js";

import { useAuthContext } from "../../_contexts/AuthContext";

const AuthGuard: ParentComponent = props => {
    const [authContext, { getToken, login }] = useAuthContext();
    const [res] = createResource(async () => {
        if (!authContext.isLoggedIn || !(await getToken())) {
            await login();
            return false;
        }

        return true;
    });

    /*
       `props.children` rather than the `children()` helper: that helper builds
       them here, so a guarded screen ran its component bodies and fired its
       queries before anyone had been let in - the Show only ever governed what
       reached the document.
    */
    return <Show when={res.latest}>{props.children}</Show>;
};

export default AuthGuard;
