import { ParentComponent, Show, children, createEffect } from "solid-js";
import { useNavigate } from "@solidjs/router";
import { useAuthContext } from "../../_contexts/AuthContext";

interface Props {
    redirectRoute?: string;
}

const AdminGuard: ParentComponent<Props> = props => {
    const [state] = useAuthContext();
    const navigate = useNavigate();
    const c = children(() => props.children);

    createEffect(() => {
        if (!state.accountStatus?.isAdmin) {
            navigate(props.redirectRoute ?? "/", { replace: true });
        }
    });

    return <Show when={state.accountStatus?.isAdmin}>{c()}</Show>;
};

export default AdminGuard;
