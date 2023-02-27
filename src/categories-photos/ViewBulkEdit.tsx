import { Component } from "solid-js";
import ContentLayout from '../components/layout/ContentLayout';
import Toolbar from "./Toolbar";

const ViewBulkEdit: Component = () => {
    return (
        <ContentLayout>
            <Toolbar />
            <div>
                <h1>Photo Categories Bulk Edit</h1>
            </div>
        </ContentLayout>
    );
};

export default ViewBulkEdit;