import { login } from "./auth/_routes";
import { categories } from "./categories/_routes";
import { about } from "./about/_routes";
import { search } from "./search/_routes";
import { stats } from "./stats/_routes";
import { settings } from "./settings/_routes";
import { catchAllRedirect } from "./redirect/_routes";
import { categoryMediaRoutes, randomMediaRoutes } from "./media/_routes";

export const appRoutes = [
    login,
    categories,
    categoryMediaRoutes,
    randomMediaRoutes,
    search,
    stats,
    about,
    settings,
    catchAllRedirect
];
