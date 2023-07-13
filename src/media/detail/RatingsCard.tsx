import { Component, Suspense, createResource } from 'solid-js';

import { useMediaListContext } from '../../contexts/MediaListContext';
import { useRatingServiceContext } from '../../contexts/RatingServiceContext';

import Rating from '../../../components/rating/Rating';

const RatingsCard: Component = (props) => {
    const {fetchRating, setRating} = useRatingServiceContext();
    const [mediaList] = useMediaListContext();
    const [ratingResource, { mutate, refetch }] = createResource(() => mediaList.activeItem?.id, fetchRating);

    const rate = async (rating: number) => {
        await setRating(mediaList.activeItem?.id, rating);
        refetch();
    };

    return (
        <Suspense>
        <table class="m-x-8">
            <tbody>
                <tr>
                    <td class="p-r-6">Your Rating</td>
                    <td>
                        <Rating
                            editable={true}
                            clickHandler={rate}
                            numberStars={5}
                            value={ratingResource()?.userRating} />
                    </td>
                </tr>
                <tr>
                    <td class="p-r-6">Average Rating</td>
                    <td>
                        <Rating
                            editable={false}
                            numberStars={5}
                            value={ratingResource()?.averageRating} />
                    </td>
                </tr>
            </tbody>
        </table>
        </Suspense>
    );
};

export default RatingsCard;
