import { ParentComponent, Show, createEffect } from "solid-js";
import { useNavigate } from "@solidjs/router";
import { useAuthContext } from "../../_contexts/AuthContext";

interface Props {
    redirectRoute?: string;
}

const AdminGuard: ParentComponent<Props> = props => {
    const [state] = useAuthContext();
    const navigate = useNavigate();
    createEffect(() => {
        if (!state.accountStatus?.isAdmin) {
            navigate(props.redirectRoute ?? "/", { replace: true });
        }
    });

    // see the note in AuthGuard on not resolving these here
    return <Show when={state.accountStatus?.isAdmin}>{props.children}</Show>;
};

export default AdminGuard;
