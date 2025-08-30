import { Component, createMemo } from "solid-js";
import { useParams, useSearchParams } from "@solidjs/router";

import { useStatsContext } from "../_contexts/api/StatsContext";
import { formatForMode, statbarMediaCountTitle } from "./_funcs";
import { CategoryStat } from "../_models/CategoryStat";
import { MediaTypeStat } from "../_models/MediaTypeStat";

import Toolbar from "./Toolbar";
import Layout from "../_components/layout/Layout";
import StatBar from "./components/StatBar";
import Treemap from "./components/Treemap";
import StatLayout from "./components/StatLayout";
import Header from "./components/Header";

const ViewYear: Component = () => {
    const { statsForYearQuery } = useStatsContext();
    const route = useParams();
    const [search] = useSearchParams();

    const stats = statsForYearQuery(() => parseInt(route.year as string, 10));

    const statbarData = createMemo(() => {
        let mediaCount = 0;
        let mediaSize = 0;
        let duration = 0;

        if (stats.isSuccess && stats.data) {
            for (const stat of stats.data) {
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
            yearCount: 1,
            categoryCount: stats.data?.length ?? 0,
            mediaCount,
            mediaSize,
            duration
        };
    });

    const sumMediaCount = (stat: CategoryStat) =>
        aggregateMedia(stat, typedStat => typedStat.mediaCount);

    const sumMediaSize = (stat: CategoryStat) =>
        aggregateMedia(stat, typedStat => typedStat.fileSize);

    const sumMediaDuration = (stat: CategoryStat) =>
        aggregateMedia(stat, typedStat => typedStat.duration);

    const aggregateMedia = (stat: CategoryStat, getValue: (typeStat: MediaTypeStat) => number) => {
        let value = 0;

        for (const typeStat of stat.mediaTypeStats) {
            value += getValue(typeStat);
        }

        return value;
    };

    const getSumForCategory = (stat: CategoryStat) => {
        switch (search?.mode) {
            case "count":
                return sumMediaCount(stat);
            case "size":
                return sumMediaSize(stat);
            case "duration":
                return sumMediaDuration(stat);
        }

        throw Error("Unexpected mode!");
    };

    const treeData = createMemo(() => {
        if (stats.isSuccess && stats.data) {
            const res = [];

            for (const stat of stats.data) {
                res.push({ name: stat.categoryName, value: getSumForCategory(stat) });
            }

            return res;
        }

        return [];
    });

    return (
        <Layout
            toolbar={
                <Toolbar
                    initialParams={{ type: "all", mode: "count" }}
                    showSummarizeByCategoryCount={false}
                />
            }
        >
            <StatLayout>
                <div class="my-2">
                    <Header
                        year={route.year}
                        mode={search.mode as string}
                        type={search.type as string}
                    />
                </div>
                <div class="my-2">
                    <StatBar
                        statbarData={statbarData()}
                        mediaCountTitle={statbarMediaCountTitle(search.type as string)}
                    />
                </div>
                <div class="my-2">
                    <Treemap
                        seriesName={route.year as string}
                        data={treeData()}
                        formatFunc={formatForMode(search.mode)}
                    />
                </div>
            </StatLayout>
        </Layout>
    );
};

export default ViewYear;
