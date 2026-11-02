import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { createAssetSession } from "./assetSession";

const LIFETIME_SECONDS = 3600;
const LIFETIME_MS = LIFETIME_SECONDS * 1000;

describe("createAssetSession", () => {
    const getToken = vi.fn<(fresh: boolean) => Promise<string | undefined>>();
    const createSession = vi.fn<(token: string) => Promise<number>>();
    const onSessionEnded = vi.fn<() => void>();

    const session = () => createAssetSession({ getToken, createSession, onSessionEnded });
    const interact = () => document.dispatchEvent(new Event("pointerdown"));
    const settle = () => vi.advanceTimersByTimeAsync(0);

    let current: ReturnType<typeof session>;

    beforeEach(() => {
        vi.useFakeTimers();
        vi.spyOn(console, "error").mockImplementation(() => undefined);
        getToken.mockReset().mockResolvedValue("token");
        createSession.mockReset().mockResolvedValue(LIFETIME_SECONDS);
        onSessionEnded.mockReset();
        current = session();
    });

    afterEach(async () => {
        await current.stop();
        vi.useRealTimers();
        vi.restoreAllMocks();
    });

    it("creates the cookie at startup with the token already held", async () => {
        await current.start();

        expect(getToken).toHaveBeenCalledExactlyOnceWith(false);
        expect(createSession).toHaveBeenCalledExactlyOnceWith("token");
    });

    it("renews at the halfway point with a new token when somebody is active", async () => {
        await current.start();

        interact();
        await vi.advanceTimersByTimeAsync(LIFETIME_MS / 2 - 1);
        expect(createSession).toHaveBeenCalledTimes(1);

        await vi.advanceTimersByTimeAsync(1);
        expect(createSession).toHaveBeenCalledTimes(2);
        expect(getToken).toHaveBeenLastCalledWith(true);
    });

    it("never renews an unattended tab", async () => {
        await current.start();

        await vi.advanceTimersByTimeAsync(LIFETIME_MS * 10);

        expect(createSession).toHaveBeenCalledTimes(1);
    });

    it("stops renewing once the activity stops", async () => {
        await current.start();

        interact();
        await vi.advanceTimersByTimeAsync(LIFETIME_MS * 10);

        expect(createSession).toHaveBeenCalledTimes(2);
    });

    it("renews at once for somebody returning after the halfway point", async () => {
        await current.start();
        await vi.advanceTimersByTimeAsync(LIFETIME_MS * 2);

        interact();
        await settle();

        expect(createSession).toHaveBeenCalledTimes(2);
    });

    it("renews when the tab becomes visible again", async () => {
        await current.start();
        await vi.advanceTimersByTimeAsync(LIFETIME_MS * 2);

        document.dispatchEvent(new Event("visibilitychange"));
        await settle();

        expect(createSession).toHaveBeenCalledTimes(2);
    });

    it.each(["timeupdate", "load"])("counts %s as somebody watching", async event => {
        await current.start();

        document.dispatchEvent(new Event(event));
        await vi.advanceTimersByTimeAsync(LIFETIME_MS / 2);

        expect(createSession).toHaveBeenCalledTimes(2);
    });

    it("does not count an image loading in a hidden tab", async () => {
        const visibility = vi.spyOn(document, "visibilityState", "get").mockReturnValue("hidden");

        await current.start();

        document.dispatchEvent(new Event("load"));
        await vi.advanceTimersByTimeAsync(LIFETIME_MS / 2);

        expect(createSession).toHaveBeenCalledTimes(1);

        visibility.mockRestore();
    });

    it("does not retry on every pointer movement after a failure", async () => {
        await current.start();
        await vi.advanceTimersByTimeAsync(LIFETIME_MS);

        createSession.mockRejectedValue(new Error("offline"));

        interact();
        await settle();
        interact();
        await settle();
        expect(createSession).toHaveBeenCalledTimes(2);

        await vi.advanceTimersByTimeAsync(30_000);
        interact();
        await settle();
        expect(createSession).toHaveBeenCalledTimes(3);
        expect(onSessionEnded).not.toHaveBeenCalled();
    });

    it("sends a renewal that finds the Auth0 session over to sign in", async () => {
        await current.start();
        await vi.advanceTimersByTimeAsync(LIFETIME_MS);

        getToken.mockRejectedValue({ error: "login_required" });

        interact();
        await settle();

        expect(onSessionEnded).toHaveBeenCalledOnce();
    });

    it("leaves sign in to the route guards at startup", async () => {
        getToken.mockRejectedValue({ error: "login_required" });

        await current.start();

        expect(onSessionEnded).not.toHaveBeenCalled();
    });

    it("does not hold up startup when the cookie can not be made, and tries again", async () => {
        createSession.mockRejectedValueOnce(new Error("api down"));

        await current.start();
        await vi.advanceTimersByTimeAsync(30_000);

        interact();
        await settle();

        expect(createSession).toHaveBeenCalledTimes(2);
    });

    it("has renewed nothing and scheduled nothing after stopping", async () => {
        await current.start();

        interact();
        await current.stop();
        await vi.advanceTimersByTimeAsync(LIFETIME_MS * 2);
        interact();
        await settle();

        expect(createSession).toHaveBeenCalledTimes(1);
    });

    it("waits for a renewal in flight when stopping", async () => {
        await current.start();
        await vi.advanceTimersByTimeAsync(LIFETIME_MS);

        let finish!: (seconds: number) => void;

        createSession.mockReturnValue(new Promise(resolve => (finish = resolve)));

        interact();
        await settle();

        let stopped = false;

        void current.stop().then(() => (stopped = true));
        await settle();
        expect(stopped).toBe(false);

        finish(LIFETIME_SECONDS);
        await settle();
        expect(stopped).toBe(true);
    });
});
