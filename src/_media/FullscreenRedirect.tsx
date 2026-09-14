import { Component, onMount } from "solid-js";
import { useLocation, useNavigate } from "@solidjs/router";

/*
   Fullscreen is no longer a place you go; its addresses are not.

   It was a route per area showing one photograph with the chrome still around
   it - and the grid already showed the same photograph, over the grid, through
   the same `MainItem`. What fullscreen had of its own was the absence of
   everything else, and that is a state rather than a destination. It is a
   toggle on the grid now.

   So the addresses stay, for as long as anyone has a link to one. The slug is
   identical in both, which makes this a substitution rather than a parse -
   `/fullscreen/a-photo` becomes `/grid/a-photo`, and the reader lands on the
   photograph they were sent. The same trick the detail view got when it went.
*/
const FullscreenRedirect: Component = () => {
    const location = useLocation();
    const navigate = useNavigate();

    onMount(() => {
        navigate(`${location.pathname.replace("/fullscreen", "/grid")}${location.search}`, {
            replace: true
        });
    });

    return <></>;
};

export default FullscreenRedirect;
