import { useSearchParams } from "@solidjs/router";
import { ParentComponent, createEffect } from "solid-js";

import { StatsProvider } from "../_contexts/api/StatsContext";

import AuthGuard from "../_components/auth/AuthGuard";

const Stats: ParentComponent = props => {
    const [search, setSearchParams] = useSearchParams();

    createEffect(() => {
        if (!search.mode) {
            setSearchParams({ mode: "count" });
        }
    });

    return (
        <AuthGuard>
            <StatsProvider>{props.children}</StatsProvider>
        </AuthGuard>
    );
};

export default Stats;
