import { Uuid } from './Uuid';

export type Scale = {
    id: Uuid;
    code: string;
    width: number;
    height: number;
    fillsDimensions: boolean;
};
