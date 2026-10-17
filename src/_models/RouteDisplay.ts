/*
   How a route shows up in navigation - its name, icon and key - kept apart from
   where it goes. The router owns the second; a link carries it, as typed
   TanStack link options, so a toolbar entry pointing somewhere that does not
   exist fails to compile rather than to load.
*/
export interface RouteDisplay {
    name: string;
    icon?: string;
    tooltip?: string;
    shortcutKeys?: string[];
    helpText?: string;
}
