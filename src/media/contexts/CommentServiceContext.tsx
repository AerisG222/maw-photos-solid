import { useContext } from "solid-js";

import { buildServiceContext } from "../../_models/utils/ServiceContextUtil";
import { ICommentService } from "../../_services/media/ICommentService";

export const { ServiceContext: CommentServiceContext, ServiceProvider: CommentServiceProvider } =
    buildServiceContext<ICommentService>();

export const useCommentServiceContext = () => {
    const ctx = useContext(CommentServiceContext);

    if (ctx) {
        return ctx;
    }

    throw new Error("CommentService context not provided by ancestor component!");
};
