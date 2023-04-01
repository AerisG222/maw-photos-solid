import { Component } from "solid-js";
import ContentLayoutNoToolbar from '../components/layout/ContentLayoutNoToolbar';
import MainContent from '../components/layout/MainContent';

const About: Component = () => {
    return (
        <ContentLayoutNoToolbar>
            <MainContent title="About">

            </MainContent>
        </ContentLayoutNoToolbar>
    );
};

export default About;
