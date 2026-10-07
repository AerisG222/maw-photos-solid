import { Component, createEffect, createSignal, For, Match, on, Show, Switch } from "solid-js";

import { describeError } from "../../_contexts/api/ApiError";
import { useMediaContext } from "../../_contexts/api/MediaContext";
import {
    describeRestrictionProblem,
    getRestrictionProblems
} from "../../_models/MediaRestrictionProblem";
import { Media } from "../../_models/Media";
import { AdminRole, excludesAdmin, sameRoles } from "../access/_restriction";

import ErrorMessage from "../../_components/error/ErrorMessage";
import Loading from "../../_components/loading/Loading";
import ConfirmDialog from "../../_components/overlay/ConfirmDialog";
import RolePicker from "../access/RolePicker";

interface Props {
    activeMedia: Media | undefined;
}

/*
   Who may see the photograph on screen, when that is fewer people than its
   category is shared with.

   A card of its own rather than another row in the Metadata Editor: that card
   is about the file - where it was taken - and this is about the audience. It
   follows the same pattern otherwise, so Save, Cancel and a separate button to
   remove the restriction, in the places the GPS override has them.
*/
const AccessCard: Component<Props> = props => {
    const { rolesQuery, mediaRolesQuery, setMediaRolesMutation, clearMediaRolesMutation } =
        useMediaContext();

    const roles = rolesQuery();
    // eslint-disable-next-line solid/reactivity -- an accessor handed to a query factory, which reads it inside its own tracked options
    const restriction = mediaRolesQuery(() => props.activeMedia?.id);

    const [selected, setSelected] = createSignal<string[]>([]);
    const [isConfirmingLockout, setIsConfirmingLockout] = createSignal(false);

    const stored = () => restriction.data ?? [];
    const isRestricted = () => stored().length > 0;

    /*
       Back to what is stored whenever that changes - a different photo, or a
       save landing. An unrestricted photo starts with the admin role ticked,
       since the first thing a restriction should not do is hide the photo from
       the person setting it.
    */
    const reset = () => setSelected(isRestricted() ? [...stored()] : [AdminRole]);

    createEffect(() => {
        if (restriction.data) {
            reset();
        }
    });

    // a refusal belongs to the photo it was for, not to the next one
    createEffect(
        on(
            () => props.activeMedia?.id,
            () => {
                setMediaRolesMutation.reset();
                clearMediaRolesMutation.reset();
            },
            { defer: true }
        )
    );

    const isDirty = () => !sameRoles(selected(), stored());
    const isPending = () => setMediaRolesMutation.isPending || clearMediaRolesMutation.isPending;
    const canSave = () => selected().length > 0 && isDirty() && !isPending();

    const apply = () => {
        const media = props.activeMedia;

        setIsConfirmingLockout(false);

        if (media) {
            clearMediaRolesMutation.reset();
            setMediaRolesMutation.mutate({ mediaId: media.id, roles: selected() });
        }
    };

    const save = (evt: Event) => {
        evt.preventDefault();

        if (excludesAdmin(selected())) {
            setIsConfirmingLockout(true);
        } else {
            apply();
        }
    };

    const cancel = (evt: Event) => {
        evt.preventDefault();

        setMediaRolesMutation.reset();
        reset();
    };

    const removeRestriction = (evt: Event) => {
        evt.preventDefault();

        const media = props.activeMedia;

        if (media) {
            setMediaRolesMutation.reset();
            clearMediaRolesMutation.mutate(media.id);
        }
    };

    const problems = () => getRestrictionProblems(setMediaRolesMutation.error);

    const otherError = () => {
        const error = setMediaRolesMutation.error ?? clearMediaRolesMutation.error;

        return error && problems().length === 0 ? describeError(error) : undefined;
    };

    return (
        <Switch fallback={<Loading />}>
            <Match when={roles.isError || restriction.isError}>
                <ErrorMessage
                    title="Could not load who may see this photo"
                    error={roles.error ?? restriction.error}
                    onRetry={() => {
                        void roles.refetch();
                        void restriction.refetch();
                    }}
                />
            </Match>

            <Match when={roles.isSuccess && restriction.isSuccess}>
                <form>
                    <p class="text-sm">
                        <Show
                            when={isRestricted()}
                            fallback="Not restricted - everyone who can see its category can see it."
                        >
                            Restricted to <strong>{stored().join(", ")}</strong>, where its category
                            is shared with them.
                        </Show>
                    </p>

                    <div class="mt-2">
                        <RolePicker
                            roles={roles.data!}
                            selected={selected()}
                            onChange={setSelected}
                        />
                    </div>

                    <div class="grid grid-cols-3 gap-2 mt-2">
                        <button class="btn btn-sm btn-outline btn-error w-full" onClick={cancel}>
                            Cancel
                        </button>
                        <button
                            class="btn btn-sm btn-outline w-full"
                            classList={{ "btn-primary": canSave(), "btn-disabled": !canSave() }}
                            disabled={!canSave()}
                            onClick={save}
                        >
                            {isRestricted() ? "Save" : "Restrict"}
                        </button>
                        <button
                            class="btn btn-sm btn-outline btn-error w-full"
                            classList={{ "btn-disabled": !isRestricted() }}
                            disabled={!isRestricted() || isPending()}
                            onClick={removeRestriction}
                        >
                            Unrestrict
                        </button>
                    </div>

                    <Show when={problems().length > 0}>
                        <ul class="text-sm text-error mt-2">
                            <For each={problems()}>
                                {problem => <li>{describeRestrictionProblem(problem)}</li>}
                            </For>
                        </ul>
                    </Show>

                    <Show when={otherError()}>
                        <p class="text-sm text-error mt-2">{otherError()}</p>
                    </Show>

                    <p class="text-xs text-muted mt-2">
                        Anyone who has already viewed it may keep a copy in their browser for up to
                        a week.
                    </p>
                </form>

                <ConfirmDialog
                    open={isConfirmingLockout()}
                    title="Hide from Admins?"
                    confirmLabel="Restrict"
                    destructive
                    onConfirm={apply}
                    onCancel={() => setIsConfirmingLockout(false)}
                >
                    Without the {AdminRole} role, you will only see this photo if you hold one of
                    the roles you chose. If you do not, it will disappear from this category for you
                    too. To change or remove the restriction later, find it under Restricted Photos
                    in this category's bulk edit.
                </ConfirmDialog>
            </Match>
        </Switch>
    );
};

export default AccessCard;
