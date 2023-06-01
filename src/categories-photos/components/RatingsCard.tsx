import { Component, Suspense, createResource } from 'solid-js';

import { getRating, ratePhoto } from '../../api/Photos';
import { usePhotoListContext } from '../../contexts/PhotoListContext';

import Rating from '../../components/rating/Rating';

const RatingsCard: Component = () => {
    const [state] = usePhotoListContext();
    const [ratingResource, { mutate, refetch }] = createResource(() => state.activePhoto?.id, getRating);

    const rate = async (rating: number) => {
        await ratePhoto(state.activePhoto?.id, rating);
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
