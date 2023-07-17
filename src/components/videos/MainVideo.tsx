import { Component } from 'solid-js';

import { Video } from '../../_models/Media';
import { VideoSizeIdType } from '../../_models/VideoSize';
import { useMediaListContext } from '../../contexts/MediaListContext';

type Props = {
    video: Video;
    videoSize: VideoSizeIdType;
};

const MainVideo: Component<Props> = (props) => {
    const [, {setMediaElement}] = useMediaListContext();

    const getVideoDimensions = (video: Video, videoSize: VideoSizeIdType) => {
        if(videoSize === 'large') {
            return {
                height: `${video.videoFullHeight}px`,
                width: `${video.videoFullWidth}px`
            };
        }

        return {
            height: `${video.videoScaledHeight}px`,
            width: `${video.videoScaledWidth}px`
        };
    };

    const getVideoUrl = (video: Video, videoSize: VideoSizeIdType) =>
        videoSize === 'large' ?
            video.videoFullUrl :
            video.videoScaledUrl;

    // todo: add option to restrict video to src size to avoid scaling?
    // style={getVideoDimensions(props.video, props.videoSize)}
    return (
        <video
            class="h-100% w-100% center-block m-auto"
            crossorigin='anonymous'  // this is required for the histogram (maybe only in dev?)
            autoplay={false}
            controls
            ref={el => setMediaElement(el)}
        >
            <source
                src={getVideoUrl(props.video, props.videoSize)}
                type="video/mp4"
            />
            Your browser does not support the
            <code>video</code> element.
        </video>
    );
};

export default MainVideo;
