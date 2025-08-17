import { Component, For, Show, createSignal } from "solid-js";

import { useMediaListContext } from "../contexts/MediaListContext";
import { useMediaContext } from "../../_contexts/api/MediaContext";

const CommentsCard: Component = () => {
    const [fetchCommentSignal, setFetchCommentSignal] = createSignal({
        media: undefined,
        service: undefined
    });
    const { commentsQuery } = useMediaContext();
    const [commentText, setCommentText] = createSignal("");
    const [mediaList] = useMediaListContext();

    const comments = commentsQuery(() => mediaList.activeItem?.id);
    // const getComments = () => {
    //     if (commentContext.service && mediaList.activeItem) {
    //         return commentContext.service.fetchComments(mediaList.activeItem.id);
    //     }
    // };

    // const [commentResource, { refetch }] = createResource(fetchCommentSignal, getComments);

    // const addComment = async (comment: string) => {
    //     await commentContext.service.addComment(mediaList.activeItem?.id, comment);
    //     refetch();
    // };

    // const commentsToDisplay = () => commentResource()?.items ?? [];

    const clearComment = (evt: Event) => {
        evt.preventDefault();

        setCommentText("");
    };

    const saveComment = async (evt: Event) => {
        evt.preventDefault();

        if (commentText()) {
            // await addComment(commentText());
        }
    };

    return (
        <>
            <Show when={comments.isSuccess}>
                <div>
                    <For each={comments.data}>
                        {comment => (
                            <div class="chat chat-start">
                                <div class="chat-header w-[100%]">
                                    <span class="mr-2">{comment.createdBy}</span>
                                    <time
                                        class="text-xs opacity-50"
                                        datetime={comment.created.toISOString()}
                                    >
                                        {comment.created.toDateString()}
                                    </time>
                                </div>
                                <div class="chat-bubble">{comment.body}</div>
                            </div>
                        )}
                    </For>
                </div>
            </Show>

            <form>
                <textarea
                    class="textarea w-[100%]"
                    placeholder="Comment"
                    onKeyDown={evt => evt.stopPropagation()}
                    onInput={evt => setCommentText(evt.currentTarget.value)}
                    value={commentText()}
                />
                <button class="btn btn-sm btn-outline btn-primary mr-4" onClick={saveComment}>
                    Save
                </button>
                <button class="btn btn-sm btn-outline btn-error" onClick={clearComment}>
                    Cancel
                </button>
            </form>
        </>
    );
};

export default CommentsCard;
