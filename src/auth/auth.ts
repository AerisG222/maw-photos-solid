import { createSignal } from "solid-js";
import { Log, User, UserManager, UserManagerSettings } from "oidc-client-ts";

export const [user, setUser] = createSignal(undefined as User|undefined);
export const [redirectUrl, setRedirectUrl] = createSignal(undefined as string);
export const accessToken = () => user()?.access_token;

const authSettings: UserManagerSettings = {
    authority: import.meta.env.VITE_AUTH_AUTHORITY,
    client_id: import.meta.env.VITE_AUTH_CLIENT_ID,
    redirect_uri: import.meta.env.VITE_AUTH_REDIRECT_URI,
    scope: "offline_access openid profile maw_api role",
    loadUserInfo: true
};

import.meta.env.DEV ? Log.setLevel(Log.DEBUG) : Log.setLevel(Log.NONE);
Log.setLogger(console);

const mgr = new UserManager(authSettings);

setUser(await mgr.getUser());

export async function initiateAuthPopup() {
    try {
        const u = await mgr.signinPopup();

        mgr.startSilentRenew();
        setUser(u);
    } catch(err) {
        console.error(err);
    }
}

export async function initiateAuthInline() {
    try {
        mgr.signinRedirect();
    } catch(err) {
        console.error(err);
    }
}

export async function completeAuth() {
    try {
        const u = await mgr.signinCallback();

        if(u) {
            mgr.startSilentRenew();
            setUser(u);
        }
    } catch(err) {
        console.error(err);
    }
}

export function isLoggedIn() {
    const u = user();

    return u ? !u.expired : false;
}

export function isAdmin() {
    const u = user();
    const role = u?.profile?.role;

    if(!role) {
        return false;
    }

    if(Array.isArray(role)) {
        return role.findIndex(r => r === "admin") >= 0;
    } else {
        return role === "admin";
    }
}
