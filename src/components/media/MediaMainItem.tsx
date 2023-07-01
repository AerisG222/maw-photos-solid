import { Component } from 'solid-js';

import { Media } from '../../models/Media';

import MainPhoto from '../photos/MainPhoto';

type Props = {
    media: Media;
    maxHeightStyle?: string;
}

const MediaMainItem: Component<Props> = (props) => {
    // we use the switch below rather than the Switch Component for a couple reasons:
    //   1. below can properly narrow type within the case (see: https://github.com/solidjs/solid/issues/199)
    //   2. remains reactive despite yellow squiggles
    //   3. ts will error if any new types are added in future
    const getMainDisplay = () => {
        if(!props.media) {
            return "";
        }

        switch (props.media.kind) {
            case 'photo':
                return <MainPhoto photo={props.media} maxHeightStyle={props.maxHeightStyle} />;
            case 'video':
                return <div>video</div>
            default:
                // eslint-disable-next-line no-case-declarations
                const _exhaustiveCheck: never = props.media;
                return _exhaustiveCheck;
        }
    }

    return (
        <>
            { () => getMainDisplay()}
        </>
    );
};

export default MediaMainItem;
