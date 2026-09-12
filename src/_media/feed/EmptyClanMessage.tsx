import { Component } from "solid-js";

import { people } from "../../people/_routes";

import EmptyState from "../../_components/state/EmptyState";

/*
   A clan with nobody in it is a real state, not a failure - the API answers its
   media call with the same 404 a hidden person would, so this is reported from
   the clan itself rather than from the feed.
*/
const EmptyClanMessage: Component<{ name: string | undefined }> = props => {
    return (
        <EmptyState
            icon="icon-[ic--round-group]"
            title={`${props.name ?? "This clan"} has nobody in it yet`}
            detail="Add people to it and their photos and videos will show up here."
            actionLabel="Back to People"
            actionHref={people.absolutePath}
        />
    );
};

export default EmptyClanMessage;
