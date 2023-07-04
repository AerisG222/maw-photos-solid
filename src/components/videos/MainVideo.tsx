import { Component } from 'solid-js';

import { Video } from '../../models/Media';
import { VideoSizeIdType } from '../../models/VideoSize';

type Props = {
    video: Video;
    videoSize: VideoSizeIdType;
};

const MainVideo: Component<Props> = (props) => {
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

    return (
        <video
            class="center-block"
            autoplay={false}
            style={getVideoDimensions(props.video, props.videoSize)}
            controls
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
