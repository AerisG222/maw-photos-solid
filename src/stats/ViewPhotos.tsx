import { Component } from "solid-js";
import numbro from 'numbro';

import { useCategoryContext } from '../contexts/CategoryContext';

import Toolbar from './Toolbar';
import Layout from '../components/layout/Layout';
import StatBox from './components/StatBox';
import StatBar from './components/StatBar';
import ToolbarPhotos from './ToolbarPhotos';

const ViewPhotos: Component = () => {
    const [state, { getPhotoCategoryYears, getPhotoCount, getPhotoFileSize }] = useCategoryContext();
    const toolbar = (
        <Toolbar>
            <ToolbarPhotos />
        </Toolbar>
    );

    return (
        <Layout toolbar={toolbar}>
            <div class="m-y-2">
                <StatBar>
                    <StatBox title="Years" value={numbro(getPhotoCategoryYears().length).format({thousandSeparated: true})} />
                    <StatBox title="Categories" value={numbro(state.photoCategories.length).format({thousandSeparated: true})} />
                    <StatBox title="Photos" value={numbro(getPhotoCount()).format({thousandSeparated: true})} />
                    <StatBox title="File Size" value={numbro(getPhotoFileSize()).format({output: "byte", base: "decimal", mantissa: 2, spaceSeparated: true})} />
                </StatBar>
            </div>
        </Layout>
    );
};

export default ViewPhotos;
