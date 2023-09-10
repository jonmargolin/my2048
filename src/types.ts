export interface Matrix {
    rows: string;
    column: TiledState[];
}
export interface TiledState {
    rowId: string;
    columNumber: number;
    tileValue: number;
}
export enum SearchDirection {
    row = 'row',
    column = 'column',
}

export enum MoveDirection {
    up = 'up',
    down = 'down',
}
