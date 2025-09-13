import { Component, For, Show, createSignal } from "solid-js";

import { useMediaContext } from "../../_contexts/api/MediaContext";
import { Category } from "../../_models/Category";
import { Media } from "../../_models/Media";

interface Props {
    activeCategory: Category | undefined;
    activeMedia: Media | undefined;
}

const CommentsCard: Component<Props> = props => {
    const { commentsQuery, addCommentMutation } = useMediaContext();
    const [commentText, setCommentText] = createSignal("");

    const comments = commentsQuery(() => props.activeMedia!.id);

    const clearComment = (evt: Event) => {
        evt.preventDefault();

        setCommentText("");
    };

    const saveComment = async (evt: Event) => {
        evt.preventDefault();

        if (commentText()) {
            const req = {
                mediaId: props.activeMedia!.id,
                comment: commentText()
            };

            addCommentMutation.mutate(req, {
                onSuccess: () => {
                    comments.refetch();
                    setCommentText("");
                }
            });
        }
    };

    return (
        <>
            <Show when={comments.isSuccess}>
                <div>
                    <For each={comments.data}>
                        {comment => (
                            <div class="mb-2">
                                <div class="flex w-full">
                                    <span class="text-xs">{comment.createdBy}</span>

                                    <span class="grow" />

                                    <time
                                        class="text-xs opacity-50"
                                        datetime={comment.created.toISOString()}
                                    >
                                        {comment.created.toDateString()}
                                    </time>
                                </div>
                                <div class="text-sm bg-base-200 w-full px-2">{comment.body}</div>
                            </div>
                        )}
                    </For>
                </div>
            </Show>

            <form class="mt-4">
                <textarea
                    class="textarea w-full"
                    placeholder="Comment"
                    onKeyDown={evt => evt.stopPropagation()}
                    onInput={evt => setCommentText(evt.currentTarget.value)}
                    value={commentText()}
                />
                <div class="flex gap-4 mt-2">
                    <button
                        class="btn btn-sm btn-outline btn-primary"
                        onClick={saveComment}
                        disabled={!commentText()}
                    >
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
