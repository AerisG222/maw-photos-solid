import { Component, createEffect, createResource, createSignal } from "solid-js";

import { useRatingServiceContext } from "../contexts/RatingServiceContext";
import { useMediaListContext } from "../contexts/MediaListContext";

import Rating from "../../_components/rating/Rating";

const RatingsCard: Component = () => {
    const [mediaList] = useMediaListContext();
    const [ratingContext] = useRatingServiceContext();
    const [fetchRatingSignal, setFetchRatingSignal] = createSignal({
        media: undefined,
        service: undefined
    });

    // option 1: use below approach to make sure we have a valid service configured
    // option 2: change to define functions that take the media type and id, and have that function
    //           call the right service based on type?
    const getRatings = () => {
        if (ratingContext.service && mediaList.activeItem) {
            return ratingContext.service.fetchRating(mediaList.activeItem.id);
        }
    };

    const [ratingResource, { refetch }] = createResource(fetchRatingSignal, getRatings);

    const rate = async (rating: number) => {
        await ratingContext.service.setIsFavorite(mediaList.activeItem?.id, rating);
        refetch();
    };

    createEffect(() => {
        setFetchRatingSignal({
            media: mediaList.activeItem,
            service: ratingContext.service
        });
    });

    return (
        <table class="mx-8">
            <tbody>
                <tr>
                    <td class="pr-6">Your Rating</td>
                    <td>
                        <Rating
                            editable={true}
                            clickHandler={rate}
                            numberStars={5}
                            value={ratingResource()?.userRating}
                        />
                    </td>
                </tr>
                <tr>
                    <td class="pr-6">Average Rating</td>
                    <td>
                        <Rating
                            editable={false}
                            numberStars={5}
                            value={ratingResource()?.averageRating}
                        />
                    </td>
                </tr>
            </tbody>
        </table>
    );
};

export default RatingsCard;
