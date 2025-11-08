import { useNavigate, useParams } from "@solidjs/router";
import { useCategoriesContext } from "../../_contexts/api/CategoriesContext";
import { MediaView } from "../../_models/MediaView";
import { CategoryMapsMediaService } from "../services/CategoryMapsMediaService";

export const useCategoryMapServices = (view: MediaView) => {
    const navigate = useNavigate();
    const params = useParams();
    const { categoryQuery, categoryMediaQuery, categoryMediaGpsQuery, categoriesForYearQuery } = useCategoriesContext();

    const categoriesQuery = categoriesForYearQuery(() => parseInt(params.categoryYear, 10));
    const categoryId = () => categoriesQuery.data?.categories?.find(x => x.year === parseInt(params.categoryYear, 10) && x.slug === params.categorySlug)?.id;
    const cq = categoryQuery(categoryId);
    const mq = categoryMediaQuery(categoryId);
    const gpsList = categoryMediaGpsQuery(categoryId);
    const mediaService = new CategoryMapsMediaService(navigate, params, view, cq, mq, gpsList);

    return { mediaService };
};
