import { Component } from 'solid-js';

import { getRating } from '../../api/Photos';
import { usePhotoListContext } from '../../contexts/PhotoListContext';

import Rating from '../../components/rating/Rating';

const RatingsCard: Component = () => {
    const [state] = usePhotoListContext();
    const ratingQuery = getRating(state.activePhoto?.id);

    return (
        <table class="m-x-8">
            <tbody>
                <tr>
                    <td class="p-r-6">Your Rating</td>
                    <td>
                        <Rating
                            editable={true}
                            clickHandler={console.log}
                            numberStars={5}
                            value={ratingQuery?.data?.userRating} />
                    </td>
                </tr>
                <tr>
                    <td class="p-r-6">Average Rating</td>
                    <td>
                        <Rating
                            editable={false}
                            numberStars={5}
                            value={ratingQuery?.data?.averageRating} />
                    </td>
                </tr>
            </tbody>
        </table>
    );
}

export default RatingsCard;
