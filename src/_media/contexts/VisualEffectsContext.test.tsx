import { cleanup, render } from "@solidjs/testing-library";
import { createSignal } from "solid-js";
import { afterEach, describe, expect, test } from "vitest";

import {
    VisualEffectsProvider,
    useResetEffectsOnMediaChange,
    useVisualEffectsContext
} from "./VisualEffectsContext";

/*
   Adjustments belong to the photograph they were applied to.

   They used to persist for as long as you stayed within a media root. A
   rotation is the clearest case against it: you turn a sideways photograph the
   right way up, step to the next one, and that one is now lying on its side for
   no reason you can see. A sepia is the same fault more quietly - it recolors
   everything you look at afterwards, and the control that undoes it is inside a
   card you may not have open.
*/
const mount = () => {
    const [subject, setSubject] = createSignal("photo-1");

    let api!: ReturnType<typeof useVisualEffectsContext>;

    const Probe = () => {
        api = useVisualEffectsContext();
        useResetEffectsOnMediaChange(subject);

        return <></>;
    };

    render(() => (
        <VisualEffectsProvider>
            <Probe />
        </VisualEffectsProvider>
    ));

    return { state: () => api[0], actions: () => api[1], setSubject };
};

afterEach(cleanup);

describe("visual effects", () => {
    test("a rotation does not follow you to the next photograph", () => {
        const { state, actions, setSubject } = mount();

        actions().rotateClockwise();
        expect(state().rotation).toBe(90);

        setSubject("photo-2");

        expect(state().rotation).toBe(0);
    });

    test("nor does a filter", () => {
        const { state, actions, setSubject } = mount();

        actions().setSepia(80);
        actions().setGrayscale(50);

        setSubject("photo-2");

        expect(state().sepia).toBe(0);
        expect(state().grayscale).toBe(0);
    });

    // arriving at the first photograph is not a change of subject
    test("they survive the first render", () => {
        const { state, actions } = mount();

        actions().setSepia(80);

        expect(state().sepia).toBe(80);
    });

    test("and staying on one photograph leaves them alone", () => {
        const { state, actions, setSubject } = mount();

        actions().flipHorizontal();
        setSubject("photo-1");

        expect(state().flipHorizontal).toBe(true);
    });
});
