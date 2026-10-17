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

export interface Area {
    display: RouteDisplay;
    // where the area starts - built with `linkOptions`, so it is checked
    link: LinkOptions;
}

/*
   The application's areas: what the primary nav offers, and what Help explains.
   One list, so the two cannot drift apart - Help used to find them by picking
   the route definitions that happened to have an icon.
*/
export const areas = {
    categories: { display: categories, link: linkOptions({ to: "/categories" }) },
    people: { display: people, link: linkOptions({ to: "/people" }) },
    places: { display: places, link: linkOptions({ to: "/places/{-$placeId}", params: {} }) },
    search: { display: search, link: linkOptions({ to: "/search" }) },
    random: { display: random, link: linkOptions({ to: "/random" }) },
    stats: { display: stats, link: linkOptions({ to: "/stats" }) },
    about: { display: about, link: linkOptions({ to: "/about" }) },
    settings: { display: settings, link: linkOptions({ to: "/settings" }) }
} satisfies Record<string, Area>;
