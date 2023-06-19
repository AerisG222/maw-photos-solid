import { Component, Suspense, createResource } from 'solid-js';

import { usePhotoListContext } from '../../contexts/PhotoListContext';
import { IMediaService } from '../../services/IMediaService';

import Rating from '../../components/rating/Rating';
import { useMediaServiceContext } from '../../contexts/PhotoMediaServicesContext';

const RatingsCard: Component = (props) => {
    const [mediaService] = useMediaServiceContext();
    const [state] = usePhotoListContext();
    const [ratingResource, { mutate, refetch }] = createResource(() => state.activePhoto?.id, mediaService.svc.fetchRating);

    const rate = async (rating: number) => {
        await mediaService.svc.setRating(state.activePhoto?.id, rating);
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
