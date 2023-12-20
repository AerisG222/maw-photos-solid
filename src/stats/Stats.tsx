import { useSearchParams } from "@solidjs/router";
import { ParentComponent, createEffect } from "solid-js";

import { StatProvider } from "./contexts/StatContext";

import AuthGuard from "../components/auth/AuthGuard";

const Stats: ParentComponent = (props) => {
    const [search, setSearchParams] = useSearchParams();

    createEffect(() => {
        if(!search.mode) {
            setSearchParams({mode: "count"});
        }
    });

    return (
        <AuthGuard>
            <StatProvider>
                { props.children }
            </StatProvider>
        </AuthGuard>
    );
};

export default Stats;
