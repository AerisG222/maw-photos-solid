import { ParentComponent, Show } from "solid-js";

import { useAuthContext } from "../_contexts/AuthContext";

import AdminGuard from "../_components/auth/AdminGuard";
import AuthGuard from "../_components/auth/AuthGuard";

/*
   Every write behind this screen is gated on the location administration scope,
   and the database checks administrator again on top of it - so a non-admin who
   reached it would see a tree they could read and nothing they could change.
   The guard sends them home instead.

   It is held until the account status has actually arrived: the guard reads
   "not an admin" from an answer that has not come back yet exactly as it reads
   it from a refusal, and would bounce a deep link to this page on a cold start.
*/
const Places: ParentComponent = props => {
    const [authContext] = useAuthContext();

    return (
        <AuthGuard>
            <Show when={authContext.accountStatus}>
                <AdminGuard>{props.children}</AdminGuard>
            </Show>
        </AuthGuard>
    );
};

export default Places;
