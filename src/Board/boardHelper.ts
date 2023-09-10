import { ROWIDMAPER } from '../const';
import { Matrix, TiledState } from '../types';

export function printBoard(board: Matrix[]) {
    const print = [];
    board.forEach((item) => {
        const colum = [];
        item.column.forEach((columItem) => {
            colum.push(columItem.tileValue);
        });
        print.push({ row: item.rows, colum: colum });
    });
    console.log(print);
}
export function updateBoardTilesPosition(board: Matrix[], boardState: TiledState[]): void {
    boardState.forEach((item) => {
        const index = ROWIDMAPER.findIndex((i) => i === item.rowId);
        board[index].column[item.columNumber].tileValue = item.tileValue;
    });
    printBoard(board);
}
export function createRow(index: number) {
    const rows: TiledState[] = [];
    for (let i = 0; i < 4; i++) {
        rows.push({
            rowId: ROWIDMAPER[index],
            columNumber: index,
            tileValue: null,
        });
    }
    return rows;
}

//summarize  the number to appearance in the board state.
function findNumberAppearance(boardState: TiledState[]): number {
    const boardLength = boardState.length;
    const count = boardState.reduce((accumulator, currentItem) => {
        if (currentItem.tileValue === 2) {
            accumulator++;
        }
        return accumulator;
    }, 0);
    return count / boardLength;
}
// Generate number for tile.
// number can be 2/4
// the result should be affected by the number 2 appearance in the board state.
export function getRandomTileNumber(boardState: TiledState[]): number {
    if (boardState.length < 1) {
        return 2;
    }
    const numberAppearance = findNumberAppearance(boardState);
    if (numberAppearance < 0.9) {
        return 2;
    }
    return 4;
}

export function getRandomRowColumNumber(min: number, max: number): number {
    // Generate a random decimal number between 0 and 1
    const randomDecimal = Math.random();

    // Scale the random decimal to the desired range (min to max)
    const randomNumber = Math.floor(randomDecimal * (max - min + 1)) + min;

    return randomNumber;
}
// check if  all tiles are occupied
export function checkBoardState(board: Matrix[]): boolean {
    let ocppiedCellLength = 0;
    board.forEach((row) => {
        row.column.forEach((cell) => {
            if (cell?.tileValue !== null) {
                ocppiedCellLength++;
            }
        });
    });
    return ocppiedCellLength < 16;
}
