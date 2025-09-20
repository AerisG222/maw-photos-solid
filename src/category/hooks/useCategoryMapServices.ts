import { useNavigate, useParams } from "@solidjs/router";
import { useCategoriesContext } from "../../_contexts/api/CategoriesContext";
import { MediaView } from "../../_models/MediaView";
import { Uuid } from "../../_models/Uuid";
import { CategoryMapsMediaService } from "../services/CategoryMapsMediaService";

export const useCategoryMapServices = (view: MediaView) => {
    const navigate = useNavigate();
    const params = useParams();
    const { categoryQuery, categoryMediaQuery, categoryMediaGpsQuery } = useCategoriesContext();

    const cq = categoryQuery(() => params.categoryId as Uuid);
    const mq = categoryMediaQuery(() => params.categoryId as Uuid);
    const gpsList = categoryMediaGpsQuery(() => params.categoryId as Uuid);
    const mediaService = new CategoryMapsMediaService(navigate, params, view, cq, mq, gpsList);

    return { mediaService };
};
