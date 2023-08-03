import { ParentComponent, children, createEffect } from "solid-js";
import { useNavigate, useParams } from "@solidjs/router";

import { useMediaListContext } from "./contexts/MediaListContext";
import { getMediaPath } from "./_routes";
import { useCategoryContext } from "../contexts/CategoryContext";
import { AppRouteDefinition } from "../_models/AppRouteDefinition";

type Props = {
    targetRoute: AppRouteDefinition;
};

const MediaSelectedGuard: ParentComponent<Props> = (props) => {
    const [categoryContext] = useCategoryContext();
    const [mediaList, { getFilteredMedia }] = useMediaListContext();
    const navigate = useNavigate();
    const params = useParams();
    const c = children(() => props.children);

    createEffect(() => {
        const media = getFilteredMedia();

        if(media.length > 0 && !mediaList.activeItem) {
            // when first loading the site from a deep link, we might not have the media list
            // loaded yet, which means that the active item was not able to be properly set. we
            // perform the check below so we can see if the id field is set in the url, which
            // should then get picked up by the active media monitor once the list is populated
            if(media.findIndex(m => m.id.toString() === params.id) >= 0) {
                return;
            }

            const m = media[0];

            if(m) {
                navigate(getMediaPath(props.targetRoute, categoryContext.activeCategory?.type, m.categoryId, m.id));
            }
        }
    });

    return(
        <>
            {c()}
        </>
    );
};

export default MediaSelectedGuard;
