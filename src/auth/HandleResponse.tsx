import { Component } from "solid-js";
import { completeAuth } from './auth';

const HandleResponse: Component = () => {
    completeAuth();

    return (
        <h1>HandleResponse</h1>
    );
};

export default HandleResponse;
