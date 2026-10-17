import { RouteNode } from "../_router/routeTree";

export type AppRouteDefinition = RouteNode & {
    absolutePath: string;
    name: string;
    icon?: string;
    tooltip?: string;
    shortcutKeys?: string[];
    helpText?: string;
    children?: AppRouteDefinition[];
};
