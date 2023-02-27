import { categoriesRoutes } from './categories/_routes';
import { aboutRoutes } from './about/_routes';
import { categoriesPhotosRoutes } from './categories-photos/_routes';
import { categoriesVideosRoutes } from './categories-videos/_routes';
import { randomRoutes } from './random/_routes';
import { searchRoutes } from './search/_routes';
import { statsRoutes } from './stats/_routes';
import { settingsRoutes } from './settings/_routes';

export const appRoutes = [
    ...categoriesRoutes,
    ...categoriesPhotosRoutes,
    ...categoriesVideosRoutes,
    ...searchRoutes,
    ...randomRoutes,
    ...statsRoutes,
    ...aboutRoutes,
    ...settingsRoutes
];
