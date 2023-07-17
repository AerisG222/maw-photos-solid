import { Component } from 'solid-js';

import { Media, MediaTypePhoto, MediaTypeVideo } from '../_models/Media';
import { useVisualEffectsContext } from '../contexts/VisualEffectsContext';

import MainPhoto from '../components/photos/MainPhoto';
import MainVideo from '../components/videos/MainVideo';

type Props = {
    media: Media;
    maxHeightStyle?: string;
}

const MediaMainItem: Component<Props> = (props) => {
    const [, { getFilterStyles, getTransformStyles }] = useVisualEffectsContext();

    // we use the switch below rather than the Switch Component for a couple reasons:
    //   1. below can properly narrow type within the case (see: https://github.com/solidjs/solid/issues/199)
    //   2. remains reactive despite yellow squiggles
    //   3. ts will error if any new types are added in future
    const getMainDisplay = () => {
        if(!props.media) {
            return <></>;
        }

        switch (props.media.kind) {
            case MediaTypePhoto:
                return <MainPhoto photo={props.media} />;
            case MediaTypeVideo:
                return <MainVideo video={props.media} videoSize={'large'} />
            default:
                // eslint-disable-next-line no-case-declarations
                const _exhaustiveCheck: never = props.media;
                return <></>;
        }
    };

    return (
        <div
            class="grid h-100% w-100% max-h-100vh max-w-100% object-contain self-center"
            style={`${props.maxHeightStyle ?? ''} ${getTransformStyles()} ${getFilterStyles()}`}>
            { getMainDisplay() }
        </div>
    );
};

export default MediaMainItem;
