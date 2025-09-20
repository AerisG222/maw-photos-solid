import { Uuid } from "./Uuid";

export interface Scale {
    id: Uuid;
    code: string;
    width: number;
    height: number;
    fillsDimensions: boolean;
}
