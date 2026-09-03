import { ParentComponent } from "solid-js";

import AuthGuard from "../_components/auth/AuthGuard";

/*
   Browsing places needs nothing beyond being signed in: the API scopes every
   listing to what the caller can already see, so a place holding nothing visible
   to them does not exist as far as this area is concerned.
*/
const Places: ParentComponent = props => {
    return <AuthGuard>{props.children}</AuthGuard>;
};

export default Places;
