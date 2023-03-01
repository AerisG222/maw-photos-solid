import { createSignal } from 'solid-js';
import { Log, User, UserManager, UserManagerSettings } from 'oidc-client-ts';

export const [user, setUser] = createSignal(undefined as User|undefined);

const authSettings: UserManagerSettings = {
    authority: 'https://dev.auth.mikeandwan.us:5001',
    client_id: 'maw-photos-solid',
    //redirect_uri: 'http://dev.photos.mikeandwan.us:3000/login/handle-response'
    redirect_uri: 'http://localhost:3000/login/handle-response'
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
