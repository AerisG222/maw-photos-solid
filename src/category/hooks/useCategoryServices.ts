import { useNavigate, useParams } from "@solidjs/router";
import { useCategoriesContext } from "../../_contexts/api/CategoriesContext";
import { useMediaPageSettingsContext } from "../../_contexts/settings/MediaPageSettingsContext";
import { SlideshowService } from "../../_media/services/SlideshowService";
import { MediaView } from "../../_models/MediaView";
import { CategoryMediaService } from "../services/CategoryMediaService";

export const useCategoryServices = (view: MediaView) => {
    const navigate = useNavigate();
    const params = useParams();
    const [mediaPageSettings] = useMediaPageSettingsContext();
    const { categoryQuery, categoryMediaQuery, categoriesForYearQuery } = useCategoriesContext();

    const categoriesQuery = categoriesForYearQuery(() => parseInt(params.categoryYear, 10));
    const categoryId = () => categoriesQuery.data?.categories?.find(x => x.year === parseInt(params.categoryYear, 10) && x.slug === params.categorySlug)?.id;
    const cq = categoryQuery(categoryId);
    const mq = categoryMediaQuery(categoryId);
    const mediaService = new CategoryMediaService(navigate, params, view, cq, mq);

    const slideshowService = new SlideshowService(
        mediaService,
        mediaPageSettings.slideshowDisplayDurationSeconds
    );

    return { mediaService, slideshowService };
};
