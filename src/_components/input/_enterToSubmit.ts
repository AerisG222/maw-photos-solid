/*
   Whether Enter in a text field should act - search, save - rather than finish a
   word being composed.

   Typing Japanese, Chinese or Korean goes through an input method, where Enter
   picks the word being converted. Acting on that Enter submits half a term. While
   composing, the event says so, and Safari - which does not - reports keyCode 229
   for that keystroke instead.
*/
export const isEnterToSubmit = (evt: KeyboardEvent) => {
    if (evt.key !== "Enter") {
        return false;
    }

    evt.preventDefault();

    return !evt.isComposing && evt.keyCode !== 229;
};
