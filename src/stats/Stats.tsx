import { useNavigate } from '@solidjs/router';
import { Component } from "solid-js";
import { authGuard } from '../auth/auth';
import { statsPhotos } from './_routes';

const Stats: Component = () => {
    authGuard();

    const navigate = useNavigate();

    navigate(statsPhotos.path);

    return <></>
};

export default Stats;
