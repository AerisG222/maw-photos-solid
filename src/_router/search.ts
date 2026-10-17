/*
   The query string as plain strings - a repeated key becomes a list - which is
   what every reader of it here expects. TanStack's default parses each value as
   JSON, so `?year=2007` would arrive as a number and `?q=true` as a boolean.
*/
export const parseSearch = (search: string) => {
    const result: Record<string, string | string[]> = {};

    for (const [key, value] of new URLSearchParams(search)) {
        const existing = result[key];

        result[key] =
            existing === undefined
                ? value
                : [...(Array.isArray(existing) ? existing : [existing]), value];
    }

    return result;
};

export const stringifySearch = (search: Record<string, unknown>) => {
    const params = new URLSearchParams();

    for (const [key, value] of Object.entries(search)) {
        for (const item of Array.isArray(value) ? value : [value]) {
            if (item !== undefined && item !== null) {
                params.append(key, String(item));
            }
        }
    }

    const text = params.toString();

    return text ? `?${text}` : "";
};
