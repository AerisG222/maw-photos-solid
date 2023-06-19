import { Component, Suspense, createResource } from 'solid-js';

import { usePhotoListContext } from '../../contexts/PhotoListContext';

import Rating from '../../components/rating/Rating';
import { useRatingServiceContext } from '../../contexts/RatingServiceContext';

const RatingsCard: Component = (props) => {
    const {fetchRating, setRating} = useRatingServiceContext();
    const [state] = usePhotoListContext();
    const [ratingResource, { mutate, refetch }] = createResource(() => state.activePhoto?.id, fetchRating);

    const rate = async (rating: number) => {
        await setRating(state.activePhoto?.id, rating);
        refetch();
    }

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
}

export default RatingsCard;
