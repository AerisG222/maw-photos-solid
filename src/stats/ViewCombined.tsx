import { Component } from "solid-js";
import { useSearchParams } from '@solidjs/router';
import numbro from 'numbro';

import { useCategoryContext } from '../contexts/CategoryContext';
import { getAggFuncs } from './_funcs';

import Toolbar from './Toolbar';
import Layout from '../components/layout/Layout';
import StatBar from './components/StatBar';
import StatBox from './components/StatBox';
import CombinedToolbar from './ToolbarCombined';
import StatLayout from './components/StatLayout';
import Treemap from './components/Treemap';

const ViewCombined: Component = () => {
    const [search] = useSearchParams();
    const [state, { getAllYears, getCombinedCount, getCombinedFileSize, getCombinedStatsChartData }] = useCategoryContext();
    const toolbar = (
        <Toolbar>
            <CombinedToolbar />
        </Toolbar>
    );

    const getStats = () => getCombinedStatsChartData(getAggFuncs(search.mode).agg);
    const getFmtFunc = () => getAggFuncs(search.mode).fmt;

    return (
        <Layout toolbar={toolbar}>
            <StatLayout>
                <div class="m-y-2">
                    <StatBar>
                        <StatBox title="Years" value={numbro(getAllYears().length).format({thousandSeparated: true})} />
                        <StatBox title="Categories" value={numbro(state.categories.length).format({thousandSeparated: true})} />
                        <StatBox title="Photos &amp; Videos" value={numbro(getCombinedCount()).format({thousandSeparated: true})} />
                        <StatBox title="File Size" value={numbro(getCombinedFileSize()).format({output: "byte", base: "decimal", mantissa: 2, spaceSeparated: true})} />
                    </StatBar>
                </div>
                <div class="m-y-2">
                    <Treemap seriesName='Combined' data={getStats()} formatFunc={getFmtFunc()} />
                </div>
            </StatLayout>
        </Layout>
    );
};

export default ViewCombined;
