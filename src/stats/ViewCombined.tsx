import { Component, Show, Suspense } from "solid-js";
import { useSearchParams } from "@solidjs/router";
import numbro from "numbro";

import { useStatsContext } from "../_contexts/api/StatsContext";
import { YearStat } from "../_models/YearStat";
import { MediaTypeStat } from "../_models/MediaTypeStat";

import Toolbar from "./Toolbar";
import Layout from "../_components/layout/Layout";
import StatBar from "./components/StatBar";
import StatBox from "./components/StatBox";
import CombinedToolbar from "./ToolbarCombined";
import StatLayout from "./components/StatLayout";
import Treemap from "./components/Treemap";
import Loading from "../_components/loading/Loading";

const ViewCombined: Component = () => {
    const [search] = useSearchParams();
    const { statsByYearQuery } = useStatsContext();

    const stats = statsByYearQuery();

    const sumMediaCount = (stats: YearStat[]) =>
        aggregateMedia(stats, typedStat => typedStat.mediaCount);

    const sumMediaSize = (stats: YearStat[]) =>
        aggregateMedia(stats, typedStat => typedStat.fileSize);

    const aggregateMedia = (stats: YearStat[], getValue: (typeStat: MediaTypeStat) => number) => {
        let value = 0;

        for (const stat of stats) {
            for (const typeStat of stat.mediaTypeStats) {
                value += getValue(typeStat);
            }
        }

        return value;
    };

    const treeData = (stats: YearStat[]) => {
        const res = [];

        for (const stat of stats) {
            res.push({ name: stat.year.toString(), value: stat.categoryCount });
        }

        return res;
    };

    return (
        <Layout
            toolbar={
                <Toolbar>
                    <CombinedToolbar />
                </Toolbar>
            }
        >
            <Suspense fallback={<Loading />}>
                <Show when={stats.isSuccess}>
                    <StatLayout>
                        <div class="my-2">
                            <StatBar>
                                <StatBox
                                    title="Years"
                                    value={numbro(stats.data!.length).format({
                                        thousandSeparated: true
                                    })}
                                />
                                <StatBox
                                    title="Categories"
                                    value={numbro(
                                        stats.data?.reduce(
                                            (accumulator, currStat) =>
                                                accumulator + currStat.categoryCount,
                                            0
                                        )
                                    ).format({
                                        thousandSeparated: true
                                    })}
                                />
                                <StatBox
                                    title="Photos &amp; Videos"
                                    value={numbro(sumMediaCount(stats.data!)).format({
                                        thousandSeparated: true
                                    })}
                                />
                                <StatBox
                                    title="File Size"
                                    value={numbro(sumMediaSize(stats.data!)).format({
                                        output: "byte",
                                        base: "decimal",
                                        mantissa: 2,
                                        spaceSeparated: true
                                    })}
                                />
                            </StatBar>
                        </div>
                        <div class="my-2">
                            <Treemap
                                seriesName="Combined"
                                data={treeData(stats.data!)}
                                formatFunc={x => x?.toString()}
                            />
                        </div>
                    </StatLayout>
                </Show>
            </Suspense>
        </Layout>
    );
};

export default ViewCombined;
