export interface Position {
    x: number;
    y: number;
}

/*
   Where the touch that began or ended was. A touch event always carries the
   touch that changed - the type just cannot know it - so this answers
   undefined rather than throwing, and the gestures already ignore a position
   they do not have.
*/
export const touchPosition = (evt: TouchEvent): Position | undefined => {
    const touch = evt.changedTouches[0];

    return touch && { x: touch.screenX, y: touch.screenY };
};
