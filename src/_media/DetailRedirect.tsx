import { Component, onMount } from "solid-js";
import { useLocation, useNavigate } from "@solidjs/router";

/*
   The detail view is gone; its addresses are not.

   It showed one photograph with a filmstrip under it and the info panel beside
   it - and the grid already showed the same photograph, over the grid, using the
   same component. Once the inspector could be opened anywhere, the only thing
   detail still had of its own was the filmstrip, a horizontal scroller that was
   a worse way of moving between photographs than the grid it sat on top of.

   So the view went and these stay, for as long as anyone has a link to one. The
   slug is identical in both, which is why this is a substitution rather than a
   parse: /detail/2019/a-category/a-photo becomes /grid/2019/a-category/a-photo,
   and the reader lands on the photograph they were sent.
*/
const DetailRedirect: Component = () => {
    const location = useLocation();
    const navigate = useNavigate();

    onMount(() => {
        navigate(`${location.pathname.replace("/detail", "/grid")}${location.search}`, {
            replace: true
        });
    });

    return <></>;
};

export default DetailRedirect;
