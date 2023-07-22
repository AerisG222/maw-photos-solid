import { Category } from '../_models/Category';
import { CategoryType, CategoryTypePhotos, CategoryTypeVideos } from '../_models/CategoryType';
import { getCategoryPath } from '../categories/_routes';
import { queryMawApi } from './Shared';
import { SearchCategory, SearchResult } from './models/SearchResult';

export const searchCategories = async (query: string, start: number): Promise<SearchResult<Category>> => {
    const searchCategories = await internalSearchCategories(query, start);

    const translateCategoryType = (multimediaType: string) =>
        multimediaType === "photo" ? CategoryTypePhotos : CategoryTypeVideos;

    const categories = searchCategories.results.map(x => ({
        id: x.id,
        type: translateCategoryType(x.multimediaType) as CategoryType,
        name: x.name,
        year: x.year,
        createDate: undefined,
        teaserImageUrl: x.teaserPhotoSqPath,
        latitude: undefined,
        longitude: undefined,
        count: undefined,
        totalSize: undefined,
        isMissingGpsData: undefined,
        route: getCategoryPath(translateCategoryType(x.multimediaType), x.id),
    }));

    return {
        results: categories,
        totalFound: searchCategories.totalFound,
        startIndex: searchCategories.startIndex
    };
};

const internalSearchCategories = (query: string, start: number) =>
    queryMawApi<SearchResult<SearchCategory>>('search/multimedia-categories', { query, start });
