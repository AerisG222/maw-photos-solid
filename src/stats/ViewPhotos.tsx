import { Component } from "solid-js";
import { useSearchParams } from '@solidjs/router';
import numbro from 'numbro';

import { useCategoryContext } from '../contexts/CategoryContext';
import { getAggFuncs } from './_funcs';

import Toolbar from './Toolbar';
import Layout from '../components/layout/Layout';
import StatBox from './components/StatBox';
import StatBar from './components/StatBar';
import ToolbarPhotos from './ToolbarPhotos';
import Treemap from './components/Treemap';

const ViewPhotos: Component = () => {
    const [search] = useSearchParams();
    const [state, { getPhotoCategoryYears, getPhotoCount, getPhotoFileSize, getPhotoStatsChartData }] = useCategoryContext();
    const toolbar = (
        <Toolbar>
            <ToolbarPhotos />
        </Toolbar>
    );

    const getPhotoStats = () => getPhotoStatsChartData(getAggFuncs(search.mode).agg);
    const getFmtFunc = () => getAggFuncs(search.mode).fmt;

    return (
        <Layout toolbar={toolbar}>
            <div class="grid grid-rows-[max-content_auto] h-[calc(100vh-.25rem)]">
                <div class="m-y-2">
                    <StatBar>
                        <StatBox title="Years" value={numbro(getPhotoCategoryYears().length).format({thousandSeparated: true})} />
                        <StatBox title="Categories" value={numbro(state.photoCategories.length).format({thousandSeparated: true})} />
                        <StatBox title="Photos" value={numbro(getPhotoCount()).format({thousandSeparated: true})} />
                        <StatBox title="File Size" value={numbro(getPhotoFileSize()).format({output: "byte", base: "decimal", mantissa: 2, spaceSeparated: true})} />
                    </StatBar>
                </div>
                <div class="m-y-2">
                    <Treemap data={getPhotoStats()} formatFunc={getFmtFunc()} />
                </div>
            </div>
        </Layout>
    );
};

export default ViewPhotos;
