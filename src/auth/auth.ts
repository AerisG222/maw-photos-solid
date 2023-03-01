import { Log, User, UserManager, UserManagerSettings } from 'oidc-client-ts';
import { createSignal } from 'solid-js';

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

export async function initiateAuth() {
    try {
        const u = await mgr.signinPopup();

        console.log("successfully completed authentication via popup");
        mgr.startSilentRenew();
        setUser(u);
    } catch(err) {
        console.error(err);
    }
}

export async function completeAuth() {
    try {
        await mgr.signinCallback();
        console.log("successfully completed authentication");
    } catch(err) {
        console.error(err);
    }
}
