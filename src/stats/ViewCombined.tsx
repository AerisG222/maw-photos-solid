import { Component } from "solid-js";
import numbro from 'numbro';

import { useCategoryContext } from '../contexts/CategoryContext';

import Toolbar from './Toolbar';
import Layout from '../components/layout/Layout';
import StatBar from './components/StatBar';
import StatBox from './components/StatBox';
import CombinedToolbar from './ToolbarCombined';

const ViewCombined: Component = () => {
    const [state, { getAllYears, getAllCategories, getCombinedCount, getCombinedFileSize }] = useCategoryContext();
    const toolbar = (
        <>
            <Toolbar>
                <CombinedToolbar />
            </Toolbar>
        </>
    );

    return (
        <Layout toolbar={toolbar}>
            <div class="m-y-2">
                <StatBar>
                    <StatBox title="Years" value={numbro(getAllYears().length).format({thousandSeparated: true})} />
                    <StatBox title="Categories" value={numbro(getAllCategories().length).format({thousandSeparated: true})} />
                    <StatBox title="Photos &amp; Videos" value={numbro(getCombinedCount()).format({thousandSeparated: true})} />
                    <StatBox title="File Size" value={numbro(getCombinedFileSize()).format({output: "byte", base: "decimal", mantissa: 2, spaceSeparated: true})} />
                </StatBar>
            </div>
        </Layout>
    );
};

export default ViewCombined;
