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
   The heart on a tile.

   It used to pin itself to the second column of the tile's two-by-two grid,
   because all three tiles that drew it had independently built the same grid
   and put it in the same corner. Tile owns the corners now, so this is the
   heart and nothing about where it sits - which is what let the media tile
   pass it as `badges.topRight` without ending up wrapped twice.
*/
const FavoriteBadge: Component<Props> = props => {
    return (
        <IconButton
            label={props.isFavorite ? "Remove from favourites" : "Add to favourites"}
            buttonClasses={"btn-xs text-primary opacity-50 hover:opacity-100 m-[1px]"}
            onClick={props.onToggle}
        >
            <FavoriteIcon isFavorite={props.isFavorite} subjectId={props.subjectId} />
        </IconButton>
    );
};

export default FavoriteBadge;
