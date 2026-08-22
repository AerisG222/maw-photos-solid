import { Component } from "solid-js";
import { A } from "@solidjs/router";

import { people } from "../../people/_routes";

interface Props {
    name: string | undefined;
}

/*
   A clan with nobody in it is a real state, not a failure - the API answers its
   media call with the same 404 a hidden person would, so this is reported from
   the clan itself rather than from the feed.
*/
const EmptyClanMessage: Component<Props> = props => {
    return (
        <div class="flex flex-col items-center text-center gap-3 my-8 mx-4">
            <span class="text-6 icon-[ic--round-group]" />

            <div>
                <p class="font-bold">{props.name ?? "This clan"} has nobody in it yet</p>
                <p class="text-sm mt-1">
                    Add people to it and their photos and videos will show up here.
                </p>
            </div>

            <A class="btn btn-sm btn-primary btn-outline" href={people.absolutePath}>
                Back to People
            </A>
        </div>
    );
};

export default EmptyClanMessage;
