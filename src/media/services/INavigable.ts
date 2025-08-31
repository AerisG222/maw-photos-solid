export interface INavigable {
    moveNext(): void;
    movePrevious(): void;
    isActiveMediaFirst(): boolean;
    isActiveMediaLast(): boolean;
}
