import { Component } from "solid-js";
import { Outlet } from "@tanstack/solid-router";

import { SearchProvider } from "./contexts/SearchContext";

// signing in is checked on the route itself - see _routeTree.tsx
const Search: Component = () => {
    return (
        <SearchProvider>
            <Outlet />
        </SearchProvider>
    );
};

export default Search;
