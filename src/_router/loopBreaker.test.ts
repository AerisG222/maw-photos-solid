import { describe, expect, test, vi } from "vitest";

import { installNavigationLoopBreaker } from "./loopBreaker";

const build = () => {
    let time = 0;
    const navigate = vi.fn((_target: string) => Promise.resolve());
    const report = vi.fn();
    const router = { navigate };

    installNavigationLoopBreaker(router, () => time, report);

    return {
        router,
        navigate,
        report,
        advance: (ms: number) => (time += ms)
    };
};

describe("a navigation loop", () => {
    test("is stopped and reported once, rather than left to freeze the tab", async () => {
        const { router, navigate, report } = build();

        for (let i = 0; i < 100; i++) {
            await router.navigate("/categories");
        }

        expect(navigate).toHaveBeenCalledTimes(25);
        expect(report).toHaveBeenCalledTimes(1);
        expect(report.mock.calls[0]![1]).toBe("/categories");
    });

    test("is not what somebody clicking around does", async () => {
        const { router, navigate, report, advance } = build();

        for (let i = 0; i < 100; i++) {
            await router.navigate("/categories");
            advance(100);
        }

        expect(navigate).toHaveBeenCalledTimes(100);
        expect(report).not.toHaveBeenCalled();
    });
});
