/*
   The role an admin holds by being one.

   A restriction applies to admins like anyone else - maw-media makes no
   exception - so a photo restricted to roles its admin does not hold drops out
   of everything they browse. Bulk edit's Restricted Photos still lists it, so
   it is not lost, but it is rarely what was meant: the screens that set a
   restriction ask before leaving this role off.
*/
export const AdminRole = "admin";

export const excludesAdmin = (roles: readonly string[]) =>
    roles.length > 0 && !roles.includes(AdminRole);

export const sameRoles = (a: readonly string[], b: readonly string[]) =>
    a.length === b.length && a.every(role => b.includes(role));
