import { Component, For, createEffect, createResource, createSignal } from 'solid-js';

import { useMediaListContext } from '../../contexts/MediaListContext';
import { useCommentServiceContext } from '../../contexts/CommentServiceContext';

const CommentsCard: Component = () => {
    const [fetchCommentSignal, setFetchCommentSignal] = createSignal({ media: undefined, service: undefined });
    const [commentContext] = useCommentServiceContext();
    const [commentText, setCommentText] = createSignal("");
    const [mediaList] = useMediaListContext();

    const getComments = () => {
        if(commentContext.service && mediaList.activeItem) {
            return commentContext.service.fetchComments(mediaList.activeItem.id);
        }
    }

    const [commentResource, { mutate, refetch }] = createResource(fetchCommentSignal, getComments);

    const addComment = async (comment: string) => {
        await commentContext.service.addComment(mediaList.activeItem?.id, comment);
        refetch();
    };

    const commentsToDisplay = () => commentResource()?.items ?? [];

    const clearComment = (evt: Event) => {
        evt.preventDefault();

        setCommentText("");
    };

    const saveComment = async (evt: Event) => {
        evt.preventDefault();

        if(commentText()) {
            await addComment(commentText())
        }
    };

    createEffect(() => {
        setFetchCommentSignal({
            media: mediaList.activeItem,
            service: commentContext.service
        });
    });

    return (
        <>
            <div>
                <For each={commentsToDisplay()}>{ comment =>
                    <div class="chat chat-start">
                        <div class="chat-header w-[100%]">
                            <span class="mr-2">{comment.username}</span>
                            <time class="text-xs opacity-50" datetime={comment.entryDate.toISOString()}>{comment.entryDate.toDateString()}</time>
                        </div>
                        <div class="chat-bubble">{comment.commentText}</div>
                    </div>
                }</For>
            </div>

            <form>
                <textarea
                    class="textarea w-[100%]"
                    placeholder="Comment"
                    onKeyDown={evt => evt.stopPropagation() }
                    onInput={evt => setCommentText(evt.currentTarget.value)}
                    value={commentText()} />
                <button class="btn btn-sm btn-outline btn-primary mr-4" onClick={saveComment}>Save</button>
                <button class="btn btn-sm btn-outline btn-error" onClick={clearComment}>Cancel</button>
            </form>
        </>
    );
};

export default CommentsCard;
