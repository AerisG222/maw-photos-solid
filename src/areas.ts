import { LinkOptions, linkOptions } from "@tanstack/solid-router";

import { RouteDisplay } from "./_models/RouteDisplay";
import { categories } from "./categories/_routes";
import { people } from "./people/_routes";
import { places } from "./places/_routes";
import { search } from "./search/_routes";
import { random } from "./random/_routes";
import { stats } from "./stats/_routes";
import { about } from "./about/_routes";
import { settings } from "./settings/_routes";
import { aboutRoute } from "./about/_routeTree";
import { categoriesRoute } from "./categories/_routeTree";
import { peopleRoute } from "./people/_routeTree";
import { placesRoute } from "./places/_routeTree";
import { randomRoute } from "./random/_routeTree";
import { searchRoute } from "./search/_routeTree";
import { settingsRoute } from "./settings/_routeTree";
import { statsRoute } from "./stats/_routeTree";

export interface Area {
    display: RouteDisplay;
    // where the area starts - built with `linkOptions`, so it is checked
    link: LinkOptions;
}

/*
   The application's areas: what the primary nav offers, and what Help explains.
   One list, so the two cannot drift apart - Help used to find them by picking
   the route definitions that happened to have an icon.

   A function rather than a constant: each link reads its route's `.to`, which
   exists only once the router does - see _router/routeTree.ts.
*/
export const getAreas = () =>
    ({
        categories: { display: categories, link: linkOptions({ to: categoriesRoute.to }) },
        people: { display: people, link: linkOptions({ to: peopleRoute.to }) },
        places: {
            display: places,
            link: linkOptions({ to: placesRoute.to, params: { placeId: undefined } })
        },
        search: { display: search, link: linkOptions({ to: searchRoute.to }) },
        random: { display: random, link: linkOptions({ to: randomRoute.to }) },
        stats: { display: stats, link: linkOptions({ to: statsRoute.to }) },
        about: { display: about, link: linkOptions({ to: aboutRoute.to }) },
        settings: { display: settings, link: linkOptions({ to: settingsRoute.to }) }
    }) satisfies Record<string, Area>;
