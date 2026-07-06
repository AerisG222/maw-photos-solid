import { RouteDefinition } from "@solidjs/router";

export type AppRouteDefinition = RouteDefinition<string> & {
    absolutePath: string;
    name: string;
    icon?: string;
    tooltip?: string;
    shortcutKeys?: string[];
    helpText?: string;
};
