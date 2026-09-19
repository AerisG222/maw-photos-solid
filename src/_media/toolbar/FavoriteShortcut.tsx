import { Component } from "solid-js";

import { IsFavoriteRequest } from "../../_models/IsFavoriteRequest";
import { Media } from "../../_models/Media";
import { useMediaContext } from "../../_contexts/api/MediaContext";

import ShortcutWrapper from "../../_components/shortcuts/ShortcutWrapper";

interface Props {
    // absent means no photograph is open, and there is nothing to mark
    activeMedia: Media | undefined;
}

/*
   The key for marking a photograph, with no button attached.

   Favoriting is the one thing in this application with no keyboard route at
   all, which is a strange gap for the one action that has no other home - the
   heart on a tile is the only way to do it. §7 asked for `h` and could not have
   it, because `h` was "show / hide badges"; that toggle was deleted on the
   argument that a setting able to hide the only route to a feature is a trap,
   and freeing this key was the unnoticed other half of the same point.

   Only with a photograph open. On a listing there is nothing selected - the
   roving cursor that would once have given a "focused tile" is gone - so a key
   that acted there would be acting on something the reader cannot see chosen.

   `ShortcutWrapper` with no children renders nothing and registers everything;
   see AdjustShortcuts, which is the same trick for the same reason.
*/
const FavoriteShortcut: Component<Props> = props => {
    const { setIsFavoriteMutation } = useMediaContext();

    const toggle = () => {
        const media = props.activeMedia;

        if (!media) {
            return;
        }

        const req: IsFavoriteRequest<Media> = { item: media, isFavorite: !media.isFavorite };

        setIsFavoriteMutation.mutate(req);
    };

    return (
        <ShortcutWrapper
            name="Favorite"
            disabled={!props.activeMedia}
            shortcutKeys={["h"]}
            clickHandler={toggle}
        />
    );
};

export default FavoriteShortcut;
