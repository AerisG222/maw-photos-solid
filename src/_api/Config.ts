import { queryMawApi } from "./Shared";
import { Scale } from '../_models/Scale';

export const getScales = async (accessToken: string): Promise<Scale[]> =>
    (await queryMawApi<Scale[]>(accessToken, "config/scales")) ?? [];
