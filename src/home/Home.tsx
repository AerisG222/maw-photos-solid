import { Component } from "solid-js";
import ContentLayout from '../components/layout/ContentLayout';
import Toolbar from "./Toolbar";

const Home: Component = () => {
    return (
        <ContentLayout>
            <Toolbar />
            <div>
                <h1>Home</h1>
                <p>Here is a variable: {import.meta.env.VITE_AUTH_CLIENT_ID}</p>
            </div>
        </ContentLayout>
    );
};

export default Home;
