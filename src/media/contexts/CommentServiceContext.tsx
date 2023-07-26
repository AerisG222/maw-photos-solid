import { useContext } from 'solid-js';

import { buildServiceContext } from '../../_models/utils/ServiceContextUtil';
import { ICommentService } from '../../_services/media/ICommentService';

export const {
    ServiceContext: CommentServiceContext,
    ServiceProvider: CommentServiceProvider
} = buildServiceContext<ICommentService>();

export const useCommentServiceContext = () => useContext(CommentServiceContext);
