import { Component } from "solid-js";
import numbro from 'numbro';

import { useCategoryContext } from '../contexts/CategoryContext';

import Toolbar from './Toolbar';
import Layout from '../components/layout/Layout';
import StatBar from './components/StatBar';
import StatBox from './components/StatBox';
import ToolbarVideo from './ToolbarVideo';

const ViewVideos: Component = () => {
    const [state, { getVideoCategoryYears, getVideoCount, getVideoFileSize, getVideoDuration }] = useCategoryContext();
    const toolbar = (
        <Toolbar>
            <ToolbarVideo />
        </Toolbar>
    );

    return (
        <Layout toolbar={toolbar}>
            <div class="m-y-2">
                <StatBar>
                    <StatBox title="Years" value={numbro(getVideoCategoryYears().length).format({thousandSeparated: true})} />
                    <StatBox title="Categories" value={numbro(state.videoCategories.length).format({thousandSeparated: true})} />
                    <StatBox title="Photos" value={numbro(getVideoCount()).format({thousandSeparated: true})} />
                    <StatBox title="File Size" value={numbro(getVideoFileSize()).format({output: "byte", base: "decimal", mantissa: 2, spaceSeparated: true})} />
                    <StatBox title="Duration" value={numbro(getVideoDuration()).format({output: "time"})} />
                </StatBar>
                </div>
        </Layout>
    );
};

export default ViewVideos;
