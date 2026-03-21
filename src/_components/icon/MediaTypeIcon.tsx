import { Component } from "solid-js";

import { MediaType } from '../../_models/MediaType';

import Icon from "./Icon";

interface Props {
    mediaType: MediaType;
    extraClasses?: string;
}

const MediaTypeIcon: Component<Props> = props => {
    const iconClass = () => {
        const klass = [];

        if(props.mediaType === 'photo') {
            klass.push("icon-[ic--round-camera]");
        }

        if(props.mediaType === 'video') {
            klass.push("icon-[ic--round-play-circle]");
        }

        if (props.extraClasses) {
            klass.push(props.extraClasses);
        }

        return klass.join(" ");
    };

    return <Icon classes={iconClass()} />;
};

export default MediaTypeIcon;
