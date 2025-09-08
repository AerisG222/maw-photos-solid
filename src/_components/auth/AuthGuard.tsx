import { ParentComponent, Show, children, createResource } from "solid-js";

import { useAuthContext } from "../../_contexts/AuthContext";

const AuthGuard: ParentComponent = props => {
    const [authContext, { getToken, login }] = useAuthContext();
    const c = children(() => props.children);

    const [res] = createResource(async () => {
        if (!authContext.isLoggedIn || !(await getToken())) {
            await login();
            return false;
        }

        return true;
    });

    return <Show when={res.latest}>{c()}</Show>;
};

export default AuthGuard;
