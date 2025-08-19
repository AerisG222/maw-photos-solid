import { Component, For, Show, createSignal } from "solid-js";

import { useMediaContext } from "../../_contexts/api/MediaContext";
import { Category } from "../../_models/Category";
import { Media } from "../../_models/Media";

export type CommentsCardProps = {
    activeCategory: Category | undefined;
    activeMedia: Media | undefined;
};

const CommentsCard: Component<CommentsCardProps> = props => {
    const { commentsQuery } = useMediaContext();
    const [commentText, setCommentText] = createSignal("");

    const comments = commentsQuery(() => props.activeMedia!.id);
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
                                <div class="chat-header w-full">
                                    <span class="mr-2">{comment.createdBy}</span>
                                    <time
                                        class="text-xs opacity-50"
                                        datetime={comment.created.toISOString()}
                                    >
                                        {comment.created.toDateString()}
                                    </time>
                                </div>
                                <div class="chat-bubble bg-base-200 w-full">{comment.body}</div>
                                <div class="chat-footer w-full"></div>
                            </div>
                        )}
                    </For>
                </div>
            </Show>

            <form>
                <textarea
                    class="textarea w-full"
                    placeholder="Comment"
                    onKeyDown={evt => evt.stopPropagation()}
                    onInput={evt => setCommentText(evt.currentTarget.value)}
                    value={commentText()}
                />
                <div class="flex gap-4 mt-2">
                    <button class="btn btn-sm btn-outline btn-primary" onClick={saveComment}>
                        Save
                    </button>
                    <button class="btn btn-sm btn-outline btn-error" onClick={clearComment}>
                        Cancel
                    </button>
                </div>
            </form>
        </>
    );
};

export default CommentsCard;
