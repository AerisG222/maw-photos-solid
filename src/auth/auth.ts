import { createSignal, onMount } from 'solid-js';
import { useNavigate } from '@solidjs/router';
import { Log, User, UserManager, UserManagerSettings } from 'oidc-client-ts';

export const [user, setUser] = createSignal(undefined as User|undefined);
export const accessToken = () => user()?.access_token;

const authSettings: UserManagerSettings = {
    authority: import.meta.env.VITE_AUTH_AUTHORITY,
    client_id: import.meta.env.VITE_AUTH_CLIENT_ID,
    redirect_uri: import.meta.env.VITE_AUTH_REDIRECT_URI,
    scope: "maw_api"
}

Log.setLogger(console);

const mgr = new UserManager(authSettings);

setUser(await mgr.getUser());

export async function initiateAuthPopup() {
    try {
        const u = await mgr.signinPopup();

        console.log("successfully completed authentication via popup");
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
            console.log("successfully completed authentication");
            mgr.startSilentRenew();
            setUser(u);
        }
    } catch(err) {
        console.error(err);
    }
}

export function isLoggedIn() {
    const u = user();

    return !!u && !u.expired;
}

// https://github.com/solidjs/solid-router/issues/75#issuecomment-1256848390
export const authGuard = () => {
    const navigate = useNavigate();

    onMount(() => {
        if(!isLoggedIn()) {
            navigate("/login", { replace: true})
        }
    });
}
