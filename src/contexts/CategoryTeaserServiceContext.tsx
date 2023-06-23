import { createContext, ParentComponent, useContext } from 'solid-js';

import { ICategoryTeaserService } from '../models/services/ICategoryTeaserService';

const CategoryTeaserServiceContext = createContext<ICategoryTeaserService>(undefined);

type Props = {
    svc: ICategoryTeaserService
};

export const CategoryTeaserServiceProvider: ParentComponent<Props> = (props) => {
    return (
        <CategoryTeaserServiceContext.Provider value={props.svc}>
            {props.children}
        </CategoryTeaserServiceContext.Provider>
    );
}

export const useCategoryTeaserServiceContext = () => useContext(CategoryTeaserServiceContext);
