import { MediaView } from "./MediaView";
import { RouteDisplay } from "./RouteDisplay";

/*
   A way of looking at media - the grid, the map, bulk edit - as a toolbar
   offers it: what it is called, and which view it is. Where it leads depends on
   which category, person or place is being browsed, so the media service builds
   that link, typed, rather than the view knowing its own path.
*/
export type MediaViewRoute = RouteDisplay & {
    mediaView: MediaView;
};
