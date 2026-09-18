import { cleanup, fireEvent, render, screen, within } from "@solidjs/testing-library";
import { afterEach, beforeEach, expect, test, vi } from "vitest";

import { AllSettingsProvider } from "../../_contexts/settings/AllSettingsProvider";
import { KEY_UI_RECENT_SEARCHES } from "../../_contexts/settings/_storage";
import { SearchProvider, useSearchContext } from "../contexts/SearchContext";
import SearchBar from "./SearchBar";

// the bar never runs a query itself - the listing below it does
vi.mock("../../_contexts/api/CategoriesContext", () => ({
    useCategoriesContext: () => ({
        categorySearchQuery: () => undefined,
        setIsFavoriteMutation: undefined
    })
}));

let activeTerm: () => string;
let resetTerms: () => void;

/*
   The search store is built on the shared default object, so a term outlives
   the provider that set it - which is what brings a reader back to their
   results after opening one, and also what would carry one test's search into
   the next. Each test puts it back.
*/
const ActiveTerm = () => {
    const [state, { clearSearchTerm, clearActiveTerm }] = useSearchContext();

    activeTerm = () => state.activeTerm;
    resetTerms = () => {
        clearSearchTerm();
        clearActiveTerm();
    };

    return null;
};

const renderBar = () =>
    render(() => (
        <AllSettingsProvider>
            <SearchProvider>
                <SearchBar />
                <ActiveTerm />
            </SearchProvider>
        </AllSettingsProvider>
    ));

const search = (term: string) => {
    const input = screen.getByPlaceholderText("Search Terms");

    fireEvent.input(input, { target: { value: term } });
    fireEvent.keyDown(input, { key: "Enter" });
};

const cancel = () => fireEvent.click(screen.getByTitle("Cancel"));

const recentTerms = () => {
    const section = screen.queryByRole("region", { name: "Recent searches" });

    return section
        ? within(section)
              .getAllByRole("listitem")
              .map(item => item.textContent)
        : [];
};

beforeEach(() => localStorage.clear());

afterEach(() => {
    resetTerms();
    cleanup();
    localStorage.clear();
});

test("a search is remembered, and survives a reload", () => {
    renderBar();
    search("paris");
    search("beach");
    cancel();

    expect(recentTerms()).toEqual(["beach", "paris"]);

    cleanup();
    renderBar();

    expect(recentTerms()).toEqual(["beach", "paris"]);
});

test("the list is only offered before a search, not over its results", () => {
    renderBar();
    search("paris");

    expect(recentTerms()).toEqual([]);
});

test("choosing a recent term runs it again", () => {
    localStorage.setItem(KEY_UI_RECENT_SEARCHES, JSON.stringify(["paris", "beach"]));
    renderBar();

    fireEvent.click(screen.getByRole("button", { name: "beach" }));

    expect(activeTerm()).toBe("beach");
    expect(screen.getByPlaceholderText("Search Terms")).toHaveValue("beach");
    cancel();
    expect(recentTerms()).toEqual(["beach", "paris"]);
});

test("one term can be removed and the rest kept", () => {
    localStorage.setItem(KEY_UI_RECENT_SEARCHES, JSON.stringify(["paris", "beach", "snow"]));
    renderBar();

    fireEvent.click(screen.getByRole("button", { name: "Remove beach from recent searches" }));

    expect(recentTerms()).toEqual(["paris", "snow"]);
    expect(activeTerm()).toBe("");
    expect(JSON.parse(localStorage.getItem(KEY_UI_RECENT_SEARCHES)!)).toEqual(["paris", "snow"]);
});

test("removing the last term leaves no list and no storage behind", () => {
    localStorage.setItem(KEY_UI_RECENT_SEARCHES, JSON.stringify(["paris"]));
    renderBar();

    fireEvent.click(screen.getByRole("button", { name: "Remove paris from recent searches" }));

    expect(screen.queryByRole("region", { name: "Recent searches" })).toBeNull();
    expect(localStorage.getItem(KEY_UI_RECENT_SEARCHES)).toBeNull();
});

test("clear history empties the list and the storage", () => {
    localStorage.setItem(KEY_UI_RECENT_SEARCHES, JSON.stringify(["paris"]));
    renderBar();

    fireEvent.click(screen.getByRole("button", { name: "Clear history" }));

    expect(recentTerms()).toEqual([]);
    expect(localStorage.getItem(KEY_UI_RECENT_SEARCHES)).toBeNull();
});
