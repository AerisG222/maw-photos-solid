import { ParentComponent, createContext, useContext } from "solid-js";
import { createStore } from "solid-js/store";

export type ShortcutInfo = {
    id: string;
    shortcut: string[];
    description: string;
};

export type ShortcutState = {
    readonly shortcuts: ShortcutInfo[];
    readonly showDialog: false;
};

export const defaultShortcutState = {
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

    const addShortcut = (shortcutInfo: ShortcutInfo) => {
        if (shortcutInfo) {
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
