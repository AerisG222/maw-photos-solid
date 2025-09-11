import { useNavigate, useParams } from '@solidjs/router';
import { useCategoriesContext } from '../../_contexts/api/CategoriesContext';
import { useMediaPageSettingsContext } from '../../_contexts/settings/MediaPageSettingsContext';
import { SlideshowService } from '../../_media/services/SlideshowService';
import { MediaView } from '../../_models/MediaView';
import { Uuid } from '../../_models/Uuid';
import { CategoryMediaService } from '../services/CategoryMediaService';

export const useCategoryServices = (view: MediaView) => {
    const navigate = useNavigate();
    const params = useParams();
    const [mediaPageSettings] = useMediaPageSettingsContext();
    const { categoryQuery, categoryMediaQuery } = useCategoriesContext();

    const cq = categoryQuery(() => params.categoryId as Uuid);
    const mq = categoryMediaQuery(() => params.categoryId as Uuid);
    const mediaService = new CategoryMediaService(navigate, params, view, cq, mq);
    const slideshowService = new SlideshowService(
        mediaService,
        mediaPageSettings.slideshowDisplayDurationSeconds
    );

    return { mediaService, slideshowService };
}
