import { ParentComponent, children, createEffect } from "solid-js";
import { useNavigate } from "@solidjs/router";
import { useAuthContext } from '../../contexts/AuthContext';

type Props = {
    redirectRoute?: string;
}

const AdminGuard: ParentComponent<Props> = (props) => {
    const [, { isAdmin }] = useAuthContext();
    const navigate = useNavigate();
    const c = children(() => props.children);

    createEffect(() => {
        if(!isAdmin()) {
            navigate(props.redirectRoute ?? "/", { replace: true });
        }
    });

    return (
        <>
            {c()}
        </>
    )
}

export default AdminGuard;
