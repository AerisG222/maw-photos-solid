import { Component } from "solid-js";
import { authGuard } from '../auth/auth';
import ContentLayout from '../components/layout/ContentLayout';
import Toolbar from "./Toolbar";

const Categories: Component = () => {
    authGuard();

    return (
        <ContentLayout>
            <Toolbar />
            <div>
                <h1>Categories</h1>
                <p>Here is a variable: {import.meta.env.VITE_AUTH_CLIENT_ID}</p>
            </div>
        </ContentLayout>
    );
};

export default Categories;
