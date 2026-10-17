import { JSX, onCleanup, splitProps } from "solid-js";
import { useRouter, useRouterState } from "@tanstack/solid-router";

/*
   The routing the application was written against, answered by TanStack Router.

   Most of the application asks very little of a router: the current params, the
   query string, where it is, and a way to go somewhere by path. Those calls are
   spread through fifty-odd files. Rather than rewrite them all in one go, this
   keeps their shape - so moving a file onto the router is one import - and lets
   each area move onto TanStack's own typed routes when it is worth doing,
   rather than all at once. The category area already has; see
   category/_routeTree.tsx.

   What is kept is the old semantics as well as the old names: params and
   search values are plain strings, read through objects whose properties are
   reactive, exactly as before.
*/

export type Params = Record<string, string | undefined>;
export type SearchParams = Record<string, string | string[] | undefined>;

export interface NavigateOptions {
    replace?: boolean;
}

export type Navigator = (to: string | number, options?: NavigateOptions) => void;

/*
   Every param of the deepest match, rather than only those of the route the
   caller sits in. The old router answered with the whole match the same way,
   and the services built on it read a category's year from components far
   above the route that names it.
*/
export const useParams = <T extends Params = Params>(): T => {
    const params = useRouterState({
        select: state => (state.matches.at(-1)?.params ?? {}) as Params
    });

    return new Proxy({} as T, {
        get: (_, key) => (typeof key === "string" ? params()[key] : undefined),
        has: (_, key) => typeof key === "string" && key in params(),
        ownKeys: () => Reflect.ownKeys(params()),
        getOwnPropertyDescriptor: (_, key) =>
            typeof key === "string" && key in params()
                ? { enumerable: true, configurable: true, value: params()[key] }
                : undefined
    });
};

/*
   Going where you already are does nothing - which is what the old router did,
   and what the application was written against. TanStack Router reloads the
   whole match instead, handing every reader a new location; an effect that
   keeps the address where it belongs then ran again on its own navigation and
   never stopped. The target is built the way TanStack builds it, so `/x/` and
   `/x`, or a query string in another order, still count as the same place.
*/
/*
   Development only: a navigation loop, caught. A loop between redirects or
   effects pins the main thread so hard the browser's own devtools will not
   open, which leaves nothing to debug it with. Past a rate no person could
   click at, stop navigating and say where it was going and who asked.
*/
const LOOP_LIMIT = 25;
let recentNavigations: number[] = [];

const isLooping = (href: string) => {
    if (!import.meta.env.DEV) {
        return false;
    }

    const now = performance.now();

    recentNavigations = [...recentNavigations.filter(at => now - at < 1000), now];

    if (recentNavigations.length > LOOP_LIMIT) {
        console.error(
            `Navigation loop: more than ${LOOP_LIMIT} navigations in a second, the latest to "${href}". Stopped - the stack below shows who asked.`,
            new Error().stack
        );

        return true;
    }

    return false;
};

const goTo = (router: ReturnType<typeof useRouter>, href: string, options?: NavigateOptions) => {
    const target = router.buildLocation({ href } as unknown as Parameters<
        typeof router.buildLocation
    >[0]);
    const trim = (value: string) => value.replace(/\/+(?=$|\?|#)/, "");

    if (trim(target.href) === trim(router.latestLocation.href) || isLooping(href)) {
        return;
    }

    void router.navigate({ href, replace: options?.replace });
};

export const useNavigate = (): Navigator => {
    const router = useRouter();

    return (to, options) => {
        if (typeof to === "number") {
            router.history.go(to);
            return;
        }

        // a whole path with its query string, as every caller here builds them
        goTo(router, to, options);
    };
};

// pathname and the raw query string, which is all anything here reads
export const useLocation = () => {
    const location = useRouterState({ select: state => state.location });

    return {
        get pathname() {
            return location().pathname;
        },
        get search() {
            return location().searchStr;
        }
    };
};

/*
   The query string as strings, and a setter that merges into it - undefined or
   null drops a key - the way the old router's did.
*/
export const useSearchParams = <T extends SearchParams = SearchParams>(): [
    Partial<T>,
    (params: Record<string, unknown>, options?: NavigateOptions) => void
] => {
    const router = useRouter();
    const search = useRouterState({ select: state => state.location.search as SearchParams });

    const read = new Proxy(
        {},
        {
            get: (_, key) => (typeof key === "string" ? search()[key] : undefined),
            has: (_, key) => typeof key === "string" && key in search(),
            ownKeys: () => Reflect.ownKeys(search()),
            getOwnPropertyDescriptor: (_, key) =>
                typeof key === "string" && key in search()
                    ? { enumerable: true, configurable: true, value: search()[key] }
                    : undefined
        }
    );

    const set = (params: Record<string, unknown>, options?: NavigateOptions) => {
        const next: Record<string, unknown> = { ...search() };

        for (const [key, value] of Object.entries(params)) {
            if (value === undefined || value === null || value === "") {
                delete next[key];
            } else {
                next[key] = value;
            }
        }

        // through the same check, so setting what is already set does nothing
        goTo(
            router,
            `${router.latestLocation.pathname}${router.options.stringifySearch(next)}`,
            options
        );
    };

    return [read, set];
};

type AnchorProps = JSX.AnchorHTMLAttributes<HTMLAnchorElement> & {
    href: string;
    // classes for when the current path is, or is not, this link's
    activeClass?: string;
    inactiveClass?: string;
    // match the path exactly, rather than it and everything beneath it
    end?: boolean;
};

const isPlainLeftClick = (evt: MouseEvent) =>
    evt.button === 0 && !evt.metaKey && !evt.altKey && !evt.ctrlKey && !evt.shiftKey;

const pathOf = (href: string) => href.split(/[?#]/)[0].replace(/\/$/, "") || "/";

/*
   A real anchor, so a middle click, a modifier or "open in new tab" all still
   do what the browser does - only a plain left click is taken over and routed.

   Lit the way the old router lit its links: by the path alone, query string
   ignored, and by prefix unless `end` asks for an exact match - so a section's
   link stays lit anywhere inside the section.
*/
export const A = (props: AnchorProps) => {
    const router = useRouter();
    const pathname = useRouterState({ select: state => state.location.pathname });
    const [local, others] = splitProps(props, [
        "href",
        "onClick",
        "activeClass",
        "inactiveClass",
        "end",
        "classList",
        "onPointerEnter",
        "onPointerLeave",
        "onFocus",
        "onBlur"
    ]);

    const isActive = () => {
        const target = pathOf(local.href);
        const current = pathOf(pathname());

        return local.end
            ? current === target
            : current === target || current.startsWith(target === "/" ? "/" : `${target}/`);
    };

    const classList = () => ({
        ...(local.activeClass ? { [local.activeClass]: isActive() } : {}),
        ...(local.inactiveClass ? { [local.inactiveClass]: !isActive() } : {}),
        ...local.classList
    });

    const onClick: JSX.EventHandler<HTMLAnchorElement, MouseEvent> = evt => {
        if (typeof local.onClick === "function") {
            local.onClick(evt);
        }

        if (
            evt.defaultPrevented ||
            !isPlainLeftClick(evt) ||
            (others.target && others.target !== "_self")
        ) {
            return;
        }

        evt.preventDefault();
        void router.navigate({ href: local.href });
    };

    /*
       Hovering or focusing a link starts its route's loader - so a category's
       photos are already on their way when it is clicked. TanStack's own <Link>
       does this; a plain anchor has to ask. After a short pause, as TanStack's
       does, so sweeping the pointer across a grid preloads nothing.
    */
    let preloadTimer: ReturnType<typeof setTimeout> | undefined;

    const startPreload = () => {
        clearTimeout(preloadTimer);
        preloadTimer = setTimeout(() => {
            /*
               An href, like navigate takes. preloadRoute builds its location the
               same way and reads one too - its type only lists `to`.
            */
            const opts = { href: local.href } as unknown as Parameters<
                typeof router.preloadRoute
            >[0];

            router.preloadRoute(opts).catch(() => {
                // a failed preload is only a missed head start - the click loads it anyway
            });
        }, router.options.defaultPreloadDelay ?? 50);
    };

    const stopPreload = () => clearTimeout(preloadTimer);

    onCleanup(stopPreload);

    // callers' own handlers still run - a tooltip renders this, and listens on the same events
    const call = <E extends Event>(
        handler: JSX.EventHandlerUnion<HTMLAnchorElement, E> | undefined,
        evt: E & { currentTarget: HTMLAnchorElement; target: Element }
    ) => {
        if (typeof handler === "function") {
            handler(evt);
        }
    };

    return (
        <a
            {...others}
            href={local.href}
            classList={classList()}
            onClick={onClick}
            onPointerEnter={evt => {
                call(local.onPointerEnter, evt);
                startPreload();
            }}
            onPointerLeave={evt => {
                call(local.onPointerLeave, evt);
                stopPreload();
            }}
            onFocus={evt => {
                call(local.onFocus, evt);
                startPreload();
            }}
            onBlur={evt => {
                call(local.onBlur, evt);
                stopPreload();
            }}
        />
    );
};
