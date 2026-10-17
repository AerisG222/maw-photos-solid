import { Component, createMemo } from "solid-js";
import { getRouteApi } from "@tanstack/solid-router";

import { useStatsContext } from "../_contexts/api/StatsContext";
import { formatForMode, statbarMediaCountTitle } from "./_funcs";
import { StatsSearch } from "./_search";
import { CategoryStat } from "../_models/CategoryStat";
import { MediaTypeStat } from "../_models/MediaTypeStat";

import Toolbar from "./components/Toolbar";
import Layout from "../_components/layout/Layout";
import StatBar from "./components/StatBar";
import Treemap from "./components/Treemap";
import StatLayout from "./components/StatLayout";
import Header from "./components/Header";
import AsyncBoundary from "../_components/state/AsyncBoundary";
import SkeletonChart from "../_components/state/SkeletonChart";
import { statsYearRoute } from "./_routeTree";

const ViewYear: Component = () => {
    const { statsForYearQuery } = useStatsContext();
    const route = getRouteApi("/stats/summary/$year");
    const params = route.useParams();
    const search = route.useSearch();
    const navigate = route.useNavigate();

    const searchType = () => search().type;
    const searchMode = () => search().mode;

    const changeSearch = (change: Partial<StatsSearch>) =>
        void navigate({
            to: statsYearRoute.to,
            params: params(),
            search: { ...search(), ...change }
        });

    const stats = statsForYearQuery(() => parseInt(params().year, 10));

    const statbarData = createMemo(() => {
        let mediaCount = 0;
        let mediaSize = 0;
        let duration = 0;

        if (stats.isSuccess && stats.data) {
            for (const stat of stats.data) {
                for (const mediaTypeStat of stat.mediaTypeStats) {
                    if (searchType() === mediaTypeStat.mediaType || searchType() === "all") {
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

    const sumMediaCount = (stat: CategoryStat, mediaType: string | undefined) =>
        aggregateMedia(stat, mediaType, typedStat => typedStat.mediaCount);

    const sumMediaSize = (stat: CategoryStat, mediaType: string | undefined) =>
        aggregateMedia(stat, mediaType, typedStat => typedStat.fileSize);

    const sumMediaDuration = (stat: CategoryStat, mediaType: string | undefined) =>
        aggregateMedia(stat, mediaType, typedStat => typedStat.duration);

    const aggregateMedia = (
        stat: CategoryStat,
        mediaType: string | undefined,
        getValue: (typeStat: MediaTypeStat) => number
    ) => {
        let value = 0;

        for (const typeStat of stat.mediaTypeStats) {
            if (
                mediaType === "all" ||
                mediaType === undefined ||
                mediaType === typeStat.mediaType
            ) {
                value += getValue(typeStat);
            }
        }

        return value;
    };

    const getSumForCategory = (stat: CategoryStat) => {
        switch (searchMode()) {
            case "count":
                return sumMediaCount(stat, searchType());
            case "size":
                return sumMediaSize(stat, searchType());
            case "duration":
                return sumMediaDuration(stat, searchType());
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
                    search={search()}
                    onChange={changeSearch}
                    showSummarizeByCategoryCount={false}
                />
            }
        >
            {/*
                this screen previously rendered an empty treemap both while the
                statistics were still arriving and after they had failed
            */}
            <AsyncBoundary
                queries={[stats]}
                errorTitle="Could not load statistics"
                when={stats.isSuccess}
                skeleton={<SkeletonChart />}
            >
                <StatLayout>
                    <div class="my-2">
                        <Header year={params().year} search={search()} />
                    </div>
                    <div class="my-2">
                        <StatBar
                            statbarData={statbarData()}
                            mediaCountTitle={statbarMediaCountTitle(searchType())}
                        />
                    </div>
                    <div class="my-2">
                        <Treemap
                            seriesName={params().year}
                            data={treeData()}
                            formatFunc={formatForMode(searchMode())}
                        />
                    </div>
                </StatLayout>
            </AsyncBoundary>
        </Layout>
    );
};

export default ViewYear;
