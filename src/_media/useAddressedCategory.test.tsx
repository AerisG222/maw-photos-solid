import { Accessor, createComputed, createRoot, createSignal } from "solid-js";
import { describe, expect, test, vi } from "vitest";

import { Uuid } from "../_models/Uuid";
import { MediaParams } from "./services/_navigation";

const asked = vi.hoisted(() => ({ year: [] as number[], category: [] as (string | undefined)[] }));

vi.mock("../_contexts/api/CategoriesContext", () => ({
    useCategoriesContext: () => ({
        categoriesForYearQuery: (year: Accessor<number>) => {
            asked.year.push(year());

            // its own signal, as a query's answer is - reading it tracks the answer, not the address
            const [data, setData] = createSignal<unknown>();
            createComputed(() => {
                const wanted = year();

                setData(
                    Number.isNaN(wanted)
                        ? undefined
                        : {
                              year: wanted,
                              categories: [{ id: "from-address", year: 2019, slug: "a-trip" }]
                          }
                );
            });

            return {
                get data() {
                    return data();
                }
            };
        },
        // keyed as a query is: asked again only when something it read changes
        categoryQuery: (id: Accessor<Uuid | undefined>) => {
            createComputed(() => asked.category.push(id()));

            return {};
        }
    })
}));

import { useAddressedCategory } from "./useAddressedCategory";

const params = () => ({ categoryYear: "2019", categorySlug: "a-trip", mediaSlug: "a-photo" });

describe("the open photo's category", () => {
    test("comes from the address before the photo has loaded", () => {
        asked.year.length = 0;

        createRoot(dispose => {
            const { categoryId } = useAddressedCategory(params);

            expect(categoryId()).toBe("from-address");
            expect(asked.year).toEqual([2019]);
            dispose();
        });
    });

    // the random stack crosses years photo by photo; a year's list for each would be waste
    test("and from the photo once it has, without asking for the year's list", () => {
        asked.year.length = 0;

        createRoot(dispose => {
            const { categoryId } = useAddressedCategory(params, () => "from-photo" as Uuid);

            expect(categoryId()).toBe("from-photo");
            expect(asked.year.every(year => Number.isNaN(year))).toBe(true);
            dispose();
        });
    });

    /*
       Picking a photo from the random grid: the address gains it while the
       photo's id is already there to be had - but the lookup first ran before
       the service that supplies it existed, so reading that id tracked nothing.
    */
    test("follows the address to a photo picked after the lookup first ran", () => {
        createRoot(dispose => {
            const [address, setAddress] = createSignal<MediaParams>({});
            const created: { service?: { categoryId: () => Uuid } } = {};
            asked.category.length = 0;

            useAddressedCategory(address, () => created.service?.categoryId());
            expect(asked.category).toEqual([undefined]);

            created.service = { categoryId: () => "from-photo" as Uuid };
            setAddress(params());

            expect(asked.category.at(-1)).toBe("from-photo");
            dispose();
        });
    });
});
