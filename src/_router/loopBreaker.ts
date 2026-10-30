/*
   A navigation loop, caught and reported instead of freezing the tab.

   A screen that keeps the address where it belongs - an effect that navigates
   when the address is wrong - can end up navigating on its own navigation, and
   then never stops. Each round is a chain of promises, so the page never gets a
   turn to draw, and the tab locks up so hard DevTools will not open: there is
   no error to read, only a frozen window. It has happened more than once.

   Development only. More navigations in a second than anybody clicks stops
   navigating and logs where it was going, with the stack of whatever asked -
   which is the line to look at.

   Every navigation goes through `router.navigate`: links, `useNavigate`, and
   the redirects a route throws, so wrapping it catches all of them. Going Back
   is the browser's own, and arrives one event at a time - it cannot pin the
   page like this.
*/

const LIMIT = 25;
const WINDOW_MS = 1000;

interface Navigable {
    navigate: (...args: never[]) => Promise<unknown>;
}

export const installNavigationLoopBreaker = <T extends Navigable>(
    router: T,
    now: () => number = () => performance.now(),
    report: (message: string, target: unknown) => void = (message, target) =>
        console.error(message, target, new Error("navigation requested from").stack)
) => {
    const original = router.navigate.bind(router) as T["navigate"];
    const recent: number[] = [];
    let tripped = false;

    router.navigate = ((...args: Parameters<T["navigate"]>) => {
        const time = now();

        recent.push(time);

        while (recent.length > 0 && time - recent[0]! > WINDOW_MS) {
            recent.shift();
        }

        if (recent.length > LIMIT) {
            if (!tripped) {
                tripped = true;
                report(
                    `Navigation loop: more than ${LIMIT} navigations in ${WINDOW_MS}ms - stopped navigating. The last was to`,
                    args[0]
                );
            }

            return Promise.resolve();
        }

        tripped = false;

        return original(...args);
    }) as T["navigate"];
};
