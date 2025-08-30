import { Component, createMemo, Show } from "solid-js";
import { useNavigate, useSearchParams } from "@solidjs/router";

import { useStatsContext } from "../_contexts/api/StatsContext";
import { YearStat } from "../_models/YearStat";
import { MediaTypeStat } from "../_models/MediaTypeStat";
import { formatForMode, statbarMediaCountTitle } from "./_funcs";
import { statsYear } from "./_routes";

import Toolbar from "./Toolbar";
import Layout from "../_components/layout/Layout";
import StatBar from "./components/StatBar";
import StatLayout from "./components/StatLayout";
import Treemap from "./components/Treemap";
import Loading from "../_components/loading/Loading";
import Header from "./components/Header";

const ViewCombined: Component = () => {
    const [search] = useSearchParams();
    const navigate = useNavigate();
    const { statsByYearQuery } = useStatsContext();

    const stats = statsByYearQuery();

    const sumCategoryCount = (stat: YearStat) => stat.categoryCount;

    const sumMediaCount = (stat: YearStat) =>
        aggregateMedia(stat, typedStat => typedStat.mediaCount);

    const sumMediaSize = (stat: YearStat) => aggregateMedia(stat, typedStat => typedStat.fileSize);

    const sumMediaDuration = (stat: YearStat) =>
        aggregateMedia(stat, typedStat => typedStat.duration);

    const aggregateMedia = (stat: YearStat, getValue: (typeStat: MediaTypeStat) => number) => {
        let value = 0;

        for (const typeStat of stat.mediaTypeStats) {
            value += getValue(typeStat);
        }

        return value;
    };

    const getSumForYear = (stat: YearStat) => {
        switch (search?.mode) {
            case "category-count":
                return sumCategoryCount(stat);
            case "count":
                return sumMediaCount(stat);
            case "size":
                return sumMediaSize(stat);
            case "duration":
                return sumMediaDuration(stat);
        }

        return undefined;
    };

    const treeData = createMemo(() => {
        if (stats.isSuccess && stats.data) {
            const res = [];

            for (const stat of stats.data) {
                res.push({ name: stat.year?.toString(), value: getSumForYear(stat) });
            }

            return res;
        }

        return [];
    });

    const statbarData = createMemo(() => {
        let yearCount = 0;
        let categoryCount = 0;
        let mediaCount = 0;
        let mediaSize = 0;
        let duration = 0;

        if (stats.isSuccess && stats.data) {
            yearCount = stats.data.length;

            for (const stat of stats.data) {
                categoryCount += stat.categoryCount;

                for (const mediaTypeStat of stat.mediaTypeStats) {
                    if (search?.type === mediaTypeStat.mediaType || search?.type === "all") {
                        mediaCount += mediaTypeStat.mediaCount;
                        mediaSize += mediaTypeStat.fileSize;
                        duration += mediaTypeStat.duration;
                    }
                }
            }
        }

        return {
            yearCount,
            categoryCount,
            mediaCount,
            mediaSize,
            duration
        };
    });

    function goToYear(year: string) {
        const path = statsYear.absolutePath.replace(":year", year);
        const type = `type=${search.type}`;
        const mode = search.mode === "category-count" ? "mode=count" : `mode=${search.mode}`;

        navigate(`${path}?${mode}&${type}`);
    }

    return (
        <Layout
            toolbar={
                <Toolbar
                    initialParams={{ type: "all", mode: "category-count" }}
                    showSummarizeByCategoryCount={true}
                />
            }
        >
            <Show when={stats.isLoading}>
                <Loading />
            </Show>

            <Show when={stats.isSuccess}>
                <StatLayout>
                    <div class="my-2">
                        <Header year={search.year as string} />
                    </div>
                    <div class="my-2">
                        <StatBar
                            statbarData={statbarData()}
                            mediaCountTitle={statbarMediaCountTitle(search.type as string)}
                        />
                    </div>
                    <div class="my-2">
                        <Treemap
                            seriesName="Summary"
                            data={treeData()}
                            formatFunc={formatForMode(search.mode)}
                            onSelectPoint={(point, event) => goToYear(point.name)}
                        />
                    </div>
                </StatLayout>
            </Show>
        </Layout>
    );
};

export default ViewCombined;
