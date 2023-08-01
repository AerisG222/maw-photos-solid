export const equalsIgnoreCase = (a: string, b: string): boolean => {
    if(!a && !b) {
        return true;
    }

    if(!a || !b) {
        return false;
    }

    return a.localeCompare(b, undefined, { sensitivity: "accent" }) === 0;
};
