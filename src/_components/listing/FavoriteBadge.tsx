import { Component } from "solid-js";

import { Uuid } from "../../_models/Uuid";

import FavoriteIcon from "../icon/FavoriteIcon";
import IconButton from "../icon/IconButton";

interface Props {
    isFavorite: boolean;
    // the heart animates on the item it belongs to - see FavoriteIcon
    subjectId: Uuid;
    onToggle: () => void;
}

/*
   The heart in the top-right corner of a tile.

   Identical, character for character, in the category, person and media tiles -
   including the pinning to the second column of their shared two-by-two grid,
   which is why it carries those classes rather than taking them as a prop.
*/
const FavoriteBadge: Component<Props> = props => {
    return (
        <div class="col-start-2 row-start-1 z-10 justify-self-end self-start">
            <IconButton
                buttonClasses={"btn-xs text-primary opacity-50 hover:opacity-100 m-[1px]"}
                onClick={props.onToggle}
            >
                <FavoriteIcon isFavorite={props.isFavorite} subjectId={props.subjectId} />
            </IconButton>
        </div>
    );
};

export default FavoriteBadge;
