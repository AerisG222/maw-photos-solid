import { Component } from "solid-js";

import { completeAuth } from './auth';

import SuccessfulLoginMonitor from './SuccessfulLoginMonitor';

const HandleResponse: Component = () => {
    completeAuth();

    return <SuccessfulLoginMonitor />;
};

export default HandleResponse;
