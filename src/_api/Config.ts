import { queryMawApi } from "./Shared";
import { Scale } from '../_models/Scale';

export const getScales = async (): Promise<Scale[]> =>
    (await queryMawApi<Scale[]>("config/scales")) ?? [];
