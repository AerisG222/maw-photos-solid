import { Component } from "solid-js";
import { useSearchParams } from '@solidjs/router';
import numbro from 'numbro';

import { useCategoryContext } from '../contexts/CategoryContext';
import { getAggFuncs } from './_funcs';

import Toolbar from './Toolbar';
import Layout from '../components/layout/Layout';
import StatBar from './components/StatBar';
import StatBox from './components/StatBox';
import ToolbarVideo from './ToolbarVideo';
import Treemap from './components/Treemap';
import StatLayout from './components/StatLayout';

const ViewVideos: Component = () => {
    const [search] = useSearchParams();
    const [, { getVideoCategories, getVideoCategoryYears, getVideoCount, getVideoFileSize, getVideoDuration, getVideoStatsChartData }] = useCategoryContext();
    const getVideoStats = () => getVideoStatsChartData(getAggFuncs(search.mode).agg);
    const getFmtFunc = () => getAggFuncs(search.mode).fmt;

    return (
        <Layout toolbar={
            <Toolbar>
                <ToolbarVideo />
            </Toolbar>
        }>
            <StatLayout>
                <div class="m-y-2">
                    <StatBar>
                        <StatBox title="Years" value={numbro(getVideoCategoryYears().length).format({thousandSeparated: true})} />
                        <StatBox title="Categories" value={numbro(getVideoCategories().length).format({thousandSeparated: true})} />
                        <StatBox title="Videos" value={numbro(getVideoCount()).format({thousandSeparated: true})} />
                        <StatBox title="File Size" value={numbro(getVideoFileSize()).format({output: "byte", base: "decimal", mantissa: 2, spaceSeparated: true})} />
                        <StatBox title="Duration" value={numbro(getVideoDuration()).format({output: "time"})} />
                    </StatBar>
                </div>
                <div class="m-y-2">
                    <Treemap seriesName='Videos' data={getVideoStats()} formatFunc={getFmtFunc()} />
                </div>
            </StatLayout>
        </Layout>
    );
};

export default ViewVideos;
