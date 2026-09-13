import { useNavigate, useParams } from "@solidjs/router";
import { useCategoriesContext } from "../../_contexts/api/CategoriesContext";
import { useMediaPageSettingsContext } from "../../_contexts/settings/MediaPageSettingsContext";
import { SlideshowService } from "../../_media/services/SlideshowService";
import { MediaView } from "../../_models/MediaView";
import { CategoryMapsMediaService } from "../services/CategoryMapsMediaService";
import { findQueryError, refetchQueries } from "../../_components/error/_queryError";

export const useCategoryMapServices = (view: MediaView) => {
    const navigate = useNavigate();
    const params = useParams();
    const [mediaPageSettings] = useMediaPageSettingsContext();
    const { categoryQuery, categoryMediaQuery, categoryMediaGpsQuery, categoriesForYearQuery } =
        useCategoriesContext();

    const categoriesQuery = categoriesForYearQuery(() => parseInt(params.categoryYear ?? "", 10));
    const categoryId = () =>
        categoriesQuery.data?.categories?.find(
            x =>
                x.year === parseInt(params.categoryYear ?? "", 10) && x.slug === params.categorySlug
        )?.id;
    const cq = categoryQuery(categoryId);
    const mq = categoryMediaQuery(categoryId);
    const gpsList = categoryMediaGpsQuery(categoryId);
    const mediaService = new CategoryMapsMediaService(
        navigate,
        params,
        view,
        () => cq,
        () => mq,
        () => gpsList
    );

    /*
       The map had no slideshow, alone among the media views - not by decision,
       just because nobody had come back to it. Watching it step between markers
       is the best thing this view does.
    */
    const slideshowService = new SlideshowService(
        mediaService,
        mediaPageSettings.slideshowDisplayDurationSeconds
    );

    const loadError = () => findQueryError([categoriesQuery, cq, mq, gpsList]);
    const retryLoad = () => refetchQueries([categoriesQuery, cq, mq, gpsList]);

    // sequential queries - see the note in useCategoryServices
    const isLoading = () =>
        categoriesQuery.isLoading ||
        (categoriesQuery.isSuccess &&
            !!categoryId() &&
            (cq.isPending || mq.isPending || gpsList.isPending));

    return { mediaService, slideshowService, isLoading, loadError, retryLoad };
};
