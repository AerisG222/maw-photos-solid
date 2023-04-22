import { useNavigate } from '@solidjs/router';
import { Component } from "solid-js";
import { authGuard } from '../auth/auth';
import { statsPhotos } from './_routes';

const StatsRedirect: Component = () => {
    authGuard();

    const navigate = useNavigate();

    navigate(statsPhotos.absolutePath);

    return <></>
};

export default StatsRedirect;
