import { RouteDisplay } from "../_models/RouteDisplay";

// how the people area shows up in navigation - the routes are in _routeTree.tsx, and
// a person's or clan's feed is a link built by `feedLink` in _media/feed/_routes.ts
export const people: RouteDisplay = {
    icon: "icon-[ic--round-people]",
    name: "People",
    helpText: "Browse photos and videos by the people that appear in them."
};
