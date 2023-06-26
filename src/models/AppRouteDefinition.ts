import { RouteDefinition } from '@solidjs/router'

export type AppRouteDefinition =
    RouteDefinition & {
        icon?: string;
        name?: string;
        tooltip?: string;
        shortcutKeys?: string[];
        absolutePath?: string;
        helpText?: string;
    };
