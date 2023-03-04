import { Component } from "solid-js";
import { authGuard } from '../auth/auth';
import ContentLayout from '../components/layout/ContentLayout';

const Search: Component = () => {
    authGuard();

    return (
        <ContentLayout>
            <span>x</span>
            <div>
                <h1>Search</h1>
            </div>
        </ContentLayout>
    );
};

export default Search;
