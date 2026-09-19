import { cleanup, fireEvent, render, screen } from "@solidjs/testing-library";
import { JSXElement, ParentComponent, children } from "solid-js";
import { afterEach, describe, expect, test, vi } from "vitest";

import { MediaBreakpointProvider } from "../../_contexts/MediaBreakpointContext";
import { AppSettingsProvider } from "../../_contexts/settings/AppSettingsContext";
import { atWidth } from "../../_testing/breakpoints";

import Tooltip from "./Tooltip";
import ToolbarLayout from "../toolbar/ToolbarLayout";
import InspectorRail from "../inspector/InspectorRail";

const WIDE = 1280;
const PHONE = 390;

const control = (name: string) => (
    <Tooltip as="button" aria-label={name} content={name}>
        {name}
    </Tooltip>
);

/*
   A page's toolbar, as the categories, search and media ones are written:
   it resolves its controls in its own body and only then hands them to the
   bar. They are created outside the bar they are drawn in - which is how
   Toggle Labels opened below while the view links beside it opened to the
   side, and what these would catch coming back.
*/
const PageToolbar: ParentComponent<{ nav: JSXElement }> = props => {
    const c = children(() => props.children);

    return <ToolbarLayout nav={props.nav}>{c()}</ToolbarLayout>;
};

const mount = (width: number, bar: () => JSXElement) => {
    atWidth(width);

    render(() => (
        <AppSettingsProvider>
            <MediaBreakpointProvider>{bar()}</MediaBreakpointProvider>
        </AppSettingsProvider>
    ));
};

// opened the way a keyboard opens it, and asked which side it chose
const opensTo = async (name: string) => {
    fireEvent.focus(screen.getByRole("button", { name }));

    const tooltip = await screen.findByRole("tooltip");
    const placement = tooltip.getAttribute("data-placement");

    fireEvent.blur(screen.getByRole("button", { name }));
    cleanup();

    return placement;
};

afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
});

describe("which way a bar's tooltips open", () => {
    test("every control in the toolbar opens to the side of the column, however it was made", async () => {
        const toolbar = () => (
            <PageToolbar nav={control("Grid")}>{control("Toggle Labels")}</PageToolbar>
        );

        mount(WIDE, toolbar);
        expect(await opensTo("Grid")).toBe("right");

        mount(WIDE, toolbar);
        expect(await opensTo("Toggle Labels")).toBe("right");
    });

    test("the toolbar along the bottom of a phone opens them upwards", async () => {
        mount(PHONE, () => (
            <PageToolbar nav={control("Grid")}>{control("Toggle Labels")}</PageToolbar>
        ));

        expect(await opensTo("Grid")).toBe("top");
    });

    test("the Inspector rail down the right edge opens them inwards", async () => {
        mount(WIDE, () => <InspectorRail>{control("Comments")}</InspectorRail>);

        expect(await opensTo("Comments")).toBe("left");
    });

    test("the Inspector rail along the bottom of a phone opens them upwards", async () => {
        mount(PHONE, () => <InspectorRail>{control("Comments")}</InspectorRail>);

        expect(await opensTo("Comments")).toBe("top");
    });

    test("outside any bar, below; and a control can always say otherwise", async () => {
        mount(WIDE, () => control("Loose"));
        expect(await opensTo("Loose")).toBe("bottom");

        mount(WIDE, () => (
            <InspectorRail>
                <Tooltip as="button" aria-label="Pinned" content="Pinned" placement="bottom">
                    Pinned
                </Tooltip>
            </InspectorRail>
        ));
        expect(await opensTo("Pinned")).toBe("bottom");
    });
});
