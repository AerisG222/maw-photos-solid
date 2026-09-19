import { ParentComponent, createContext, useContext } from "solid-js";
import { createStore } from "solid-js/store";

export interface ShortcutInfo {
    id: string;
    shortcut: string[];
    description: string;
}

export interface ShortcutState {
    readonly shortcuts: ShortcutInfo[];
    readonly showDialog: boolean;
}

export const defaultShortcutState: ShortcutState = {
    shortcuts: [],
    showDialog: false
};

export type ShortcutContextValue = [
    state: ShortcutState,
    actions: {
        addShortcut: (shortcutInfo: ShortcutInfo) => void;
        removeShortcut: (id: string) => void;
        setShowDialog: (doShow: boolean) => void;
    }
];

const ShortcutContext = createContext<ShortcutContextValue>();

export const ShortcutProvider: ParentComponent = props => {
    const [state, setState] = createStore(defaultShortcutState);

    const normalize = (shortcut: string[]) => shortcut.join("+").toUpperCase();

    /*
       Two different things must not answer one key.

       They used to, routinely: `k` was both a feed's listing switch and the
       category teaser card, `e` both an edit mode and the effects card, `o` both
       a sort and a histogram. Every one was found by someone pressing it. This
       says so at the moment of registration instead.

       Reported rather than thrown. A key genuinely held twice is a mistake worth
       shouting about, but a route change can briefly have the outgoing screen's
       controls mounted alongside the incoming one's, and taking the application
       down over a transient overlap would be worse than the fault it is
       reporting.
    */
    const warnOnCollision = (shortcutInfo: ShortcutInfo) => {
        if (!import.meta.env.DEV) {
            return;
        }

        const key = normalize(shortcutInfo.shortcut);
        const held = state.shortcuts.find(
            existing =>
                normalize(existing.shortcut) === key &&
                existing.description !== shortcutInfo.description
        );

        if (held) {
            console.error(
                `Shortcut collision: "${key}" is registered for both "${held.description}" and "${shortcutInfo.description}".`
            );
        }
    };

    const addShortcut = (shortcutInfo: ShortcutInfo) => {
        if (shortcutInfo) {
            warnOnCollision(shortcutInfo);
            setState(s => ({ shortcuts: [...s.shortcuts, shortcutInfo] }));
        }
    };

    const removeShortcut = (id: string) => {
        if (!id) {
            return;
        }

        const idx = state.shortcuts.findIndex(s => s.id === id);

        if (idx >= 0) {
            setState(s => ({ shortcuts: s.shortcuts.toSpliced(idx, 1) }));
        }
    };

    const setShowDialog = (doShow: boolean) => {
        setState({ showDialog: doShow });
    };

    return (
        <ShortcutContext.Provider value={[state, { addShortcut, removeShortcut, setShowDialog }]}>
            {props.children}
        </ShortcutContext.Provider>
    );
};

export const useShortcutContext = () => {
    const ctx = useContext(ShortcutContext);

    if (ctx) {
        return ctx;
    }

    throw new Error("Shortcut context not provided by ancestor component!");
};
