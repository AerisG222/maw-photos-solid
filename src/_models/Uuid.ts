export type Uuid = string & { readonly __brand: unique symbol };

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/*
   Whether a route parameter is actually an id. Route patterns match on shape
   alone, so a typed url can hand a page a segment that was never an id at all -
   this lets such a page bail out rather than issue a request built from it.
*/
export const isUuid = (value: string | undefined): value is Uuid =>
    !!value && UUID_PATTERN.test(value);
