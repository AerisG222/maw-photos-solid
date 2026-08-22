import { login } from "./auth/_routes";
import { categories } from "./categories/_routes";
import { about } from "./about/_routes";
import { people } from "./people/_routes";
import { personMediaRoutes } from "./person/_routes";
import { clanMediaRoutes } from "./clan/_routes";
import { search } from "./search/_routes";
import { stats } from "./stats/_routes";
import { settings } from "./settings/_routes";
import { catchAllRedirect } from "./redirect/_routes";
import { mediaRoutes } from "./category/_routes";
import { randomMediaRoutes } from "./random/_routes";

export const appRoutes = [
    login,
    categories,
    mediaRoutes,
    people,
    clanMediaRoutes,
    personMediaRoutes,
    randomMediaRoutes,
    search,
    stats,
    about,
    settings,
    catchAllRedirect
];
