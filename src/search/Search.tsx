import { ParentComponent } from "solid-js";

import { SearchProvider } from "./contexts/SearchContext";

import AuthGuard from "../components/auth/AuthGuard";

const Search: ParentComponent = (props) => {
    return (
        <AuthGuard>
        <SearchProvider>
            { props.children }
        </SearchProvider>
        </AuthGuard>
    );
};

export default Search;
