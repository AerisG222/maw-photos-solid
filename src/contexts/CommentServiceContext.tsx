import { createContext, ParentComponent, useContext } from 'solid-js';

import { ICommentService } from '../models/services/ICommentService';

const CommentServiceContext = createContext<ICommentService>(undefined);

type Props = {
    svc: ICommentService
};

export const CommentServiceProvider: ParentComponent<Props> = (props) => {
    return (
        <CommentServiceContext.Provider value={props.svc}>
            {props.children}
        </CommentServiceContext.Provider>
    );
}

export const useCommentServiceContext = () => useContext(CommentServiceContext);
