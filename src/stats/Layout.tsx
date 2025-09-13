import { ParentComponent } from "solid-js";

import { StatsProvider } from "../_contexts/api/StatsContext";

import AuthGuard from "../_components/auth/AuthGuard";

const Stats: ParentComponent = props => {
    return (
        <AuthGuard>
            <StatsProvider>{props.children}</StatsProvider>
        </AuthGuard>
    );
};

export default Stats;
