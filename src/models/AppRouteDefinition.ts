import { RouteDefinition } from '@solidjs/router'

export type AppRouteDefinition =
    RouteDefinition & {
        icon?: string;
        name?: string;
    };
