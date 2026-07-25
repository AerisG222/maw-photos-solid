import { useNavigate, useParams } from "@solidjs/router";
import { useCategoriesContext } from "../../_contexts/api/CategoriesContext";
import { useMediaPageSettingsContext } from "../../_contexts/settings/MediaPageSettingsContext";
import { SlideshowService } from "../../_media/services/SlideshowService";
import { MediaView } from "../../_models/MediaView";
import { CategoryMediaService } from "../services/CategoryMediaService";
import { findQueryError, refetchQueries } from "../../_components/error/_queryError";

export const useCategoryServices = (view: MediaView) => {
    const navigate = useNavigate();
    const params = useParams();
    const [mediaPageSettings] = useMediaPageSettingsContext();
    const { categoryQuery, categoryMediaQuery, categoriesForYearQuery } = useCategoriesContext();

    const categoriesQuery = categoriesForYearQuery(() => parseInt(params.categoryYear ?? "", 10));
    const categoryId = () =>
        categoriesQuery.data?.categories?.find(
            x =>
                x.year === parseInt(params.categoryYear ?? "", 10) && x.slug === params.categorySlug
        )?.id;
    const cq = categoryQuery(categoryId);
    const mq = categoryMediaQuery(categoryId);
    const mediaService = new CategoryMediaService(navigate, params, view, cq, mq);

    const slideshowService = new SlideshowService(
        mediaService,
        mediaPageSettings.slideshowDisplayDurationSeconds
    );

    // the view renders nothing until the category resolves, so without this a
    // failure anywhere in the chain is just a permanently blank screen
    const loadError = () => findQueryError([categoriesQuery, cq, mq]);
    const retryLoad = () => refetchQueries([categoriesQuery, cq, mq]);

    /*
       These queries run in sequence: the year list yields the id that unlocks
       the category and its media, so `cq.isLoading` alone reports false both
       before the id exists and in the instant between it arriving and the fetch
       starting - each a blank gap. Tracking the whole chain keeps it continuous.

       A slug matching nothing never produces an id, so this settles on false
       rather than spinning forever; the view falls through and renders empty,
       exactly as it did before.
    */
    const isLoading = () =>
        categoriesQuery.isLoading ||
        (categoriesQuery.isSuccess && !!categoryId() && (cq.isPending || mq.isPending));

    return { mediaService, slideshowService, isLoading, loadError, retryLoad };
};
