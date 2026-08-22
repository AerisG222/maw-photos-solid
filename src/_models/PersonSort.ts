import { KeyValuePair } from "./KeyValuePair";

export const PersonSortName = "name";
export const PersonSortMediaCount = "mediaCount";

export type PersonSortIdType = typeof PersonSortName | typeof PersonSortMediaCount;

export const allPersonSorts: KeyValuePair<PersonSortIdType>[] = [
    { id: PersonSortName, name: "Name" },
    { id: PersonSortMediaCount, name: "Media Count" }
];

export const defaultPersonSort: PersonSortIdType = PersonSortName;

export const getNextPersonSort = (sort: PersonSortIdType): PersonSortIdType =>
    sort === PersonSortName ? PersonSortMediaCount : PersonSortName;

export const getPersonSortIcon = (sort: PersonSortIdType) =>
    sort === PersonSortName
        ? "icon-[mdi--sort-alphabetical-variant]"
        : "icon-[mdi--sort-numeric-variant]";
