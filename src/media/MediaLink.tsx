import { ParentComponent, children } from 'solid-js';
import { A } from '@solidjs/router';

import { Media } from '../models/Media';

type Props = {
    url: string;
    rounded: boolean;
    isActiveItem: boolean;
    media: Media;
    scroll?: (el: HTMLAnchorElement, media: Media) => void;
};

const MediaLink: ParentComponent<Props> = (props) => {
    const c = children(() => props.children);

    const getClassList = () => {
        return ({
            'cursor-pointer': true,
            'mr-[0.1rem]': true,
            'saturate-20': true,
            'hover:saturate-100': true,
            'border-1': true,
            'border-transparent': true,
            'hover:border-primary': true,
            'rounded-1': props.rounded,
            'saturate-100!': props.isActiveItem,
            'border-primary!': props.isActiveItem
        });
    };

    return (
        <A
            classList={getClassList()}
            href={props.url}
            ref={el => props.scroll ? props.scroll(el, props.media) : ()=>{}}>
                {c()}
        </A>
    );
};

export default MediaLink;
