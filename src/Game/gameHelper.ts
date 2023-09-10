import { ROWIDMAPER } from '../const';
import { Matrix, MoveDirection, SearchDirection, TiledState } from '../types';

// filter the board state according to colum and sort it in descending order
export function filterColumNumber(board: Matrix[]): Matrix[] {
    const updateBoard: Matrix[] = [];
    for (let index = 0; index < board.length; index++) {
        let boardLength = 0;
        const columArray: TiledState[] = [];
        while (boardLength < board.length) {
            columArray.push(board[boardLength].column[index]);
            boardLength++;
        }
        updateBoard.push({ rows: ROWIDMAPER[index], column: columArray });
    }
    return updateBoard;
}

// filter the board state according to row state sort it in descending order
export function filterByRowId(boardState: TiledState[], searchDirection: string, columIndex: number, mergeDirection: 'up' | 'down'): TiledState[] {
    const colum = boardState.filter((currentColum) => {
        const rowId = ROWIDMAPER.indexOf(currentColum[searchDirection]);
        if (rowId === columIndex) {
            return currentColum;
        }
    });
    colum.sort((a, b) => a.columNumber - b.columNumber);
    if (mergeDirection === 'down') {
        colum.reverse();
    }

    return colum;
}
// the length to the nernst empty tile.
export function findEmptyTitle(
    rowColumn: TiledState[],
    currentIndex: number,
    length: number,
    direction: MoveDirection,
    searchDirection: SearchDirection
): number {
    let nextIndex = 0;
    if (searchDirection === SearchDirection.row) {
        nextIndex = direction === MoveDirection.up ? currentIndex + 1 : currentIndex - 1;
    }
    if (searchDirection === SearchDirection.column) {
        nextIndex = direction === MoveDirection.down ? currentIndex + 1 : currentIndex - 1;
    }

    if (nextIndex > rowColumn.length) {
        return length;
    }
    if (nextIndex < 0) {
        return length;
    }

    if (rowColumn[nextIndex]?.tileValue === null && rowColumn.length > currentIndex) {
        return findEmptyTitle(rowColumn, nextIndex, length + 1, direction, searchDirection);
    }

    if (rowColumn[nextIndex]?.tileValue !== null) {
        return length;
    }
}
// find the index of the first cell with value
export function findFirstIndexNotNull(rowColumn: TiledState[]): number {
    for (let index = 0; index <= rowColumn.length - 1; index++) {
        if (rowColumn[index]?.tileValue != null && rowColumn[index + 1]?.tileValue === null) {
            return index;
        }
    }
    return undefined;
}

// update the required column in the selected row.
export function updateRowInColumn(
    length: number,
    rowColumn: TiledState[],
    currentIndex: number,
    direction: MoveDirection,
    board: Matrix[],
    indexRow: number
): void {
    if (length === 0) {
        return;
    }
    const nextIndex = direction === MoveDirection.up ? currentIndex - 1 : currentIndex + 1;
    const updateLength = direction === MoveDirection.up ? length - currentIndex : currentIndex + length;
    if (nextIndex > rowColumn.length) {
        return;
    }
    if (nextIndex < 0 || updateLength < 0) {
        return;
    }
    if (rowColumn[currentIndex]?.tileValue !== null && rowColumn[nextIndex]?.tileValue == null) {
        const tileValue = rowColumn[currentIndex]?.tileValue;
        board[updateLength].column[indexRow].tileValue = tileValue;
        board[currentIndex].column[indexRow].tileValue = null;
    }
}
// update the required row in the selected column.
export function updateColumnInRow(
    length: number,
    rowColumn: TiledState[],
    currentIndex: number,
    direction: MoveDirection,
    board: Matrix[],
    indexRow: number
): void {
    if (length === 0) {
        return;
    }
    const nextIndex = direction === MoveDirection.up ? currentIndex + 1 : currentIndex - 1;
    const updateLength = direction === MoveDirection.up ? length + currentIndex : currentIndex - length;
    if (nextIndex > rowColumn.length) {
        return;
    }
    if (nextIndex < 0 || updateLength < 0) {
        return;
    }
    if (rowColumn[currentIndex]?.tileValue === null) {
        direction === MoveDirection.up ? currentIndex++ : currentIndex--;
        return updateColumnInRow(length, rowColumn, currentIndex, direction, board, indexRow);
    }
    if (rowColumn[currentIndex]?.tileValue !== null && rowColumn[nextIndex]?.tileValue == null) {
        const tileValue = rowColumn[currentIndex]?.tileValue;
        board[indexRow].column[updateLength].tileValue = tileValue;
        board[indexRow].column[currentIndex].tileValue = null;
        direction === MoveDirection.up ? currentIndex++ : currentIndex--;
        return updateColumnInRow(length, rowColumn, currentIndex, direction, board, indexRow);
    }
}

// update the required row in the selected column in recursive form
export function moveItemInRow(
    length: number,
    rowColumn: TiledState[],
    currentIndex: number,
    direction: MoveDirection,
    board: Matrix[],
    indexRow: number,
    didUpdate = false
): boolean {
    if (length === 0) {
        return didUpdate;
    }
    const nextIndex = direction === MoveDirection.up ? currentIndex + 1 : currentIndex - 1;
    const updateLength = direction === MoveDirection.up ? Math.abs(length + currentIndex) : currentIndex - length;
    if (length > rowColumn.length || length < 0) {
        return didUpdate;
    }
    if (updateLength < 0 || currentIndex < 0) {
        return didUpdate;
    }
    if (updateLength >= rowColumn.length || currentIndex >= rowColumn.length) {
        return didUpdate;
    }
    if (
        rowColumn[currentIndex]?.tileValue !== null &&
        rowColumn[nextIndex]?.tileValue !== null &&
        rowColumn[currentIndex]?.tileValue !== rowColumn[nextIndex]?.tileValue
    ) {
        return didUpdate;
    }
    if (rowColumn[currentIndex]?.tileValue !== null && rowColumn[currentIndex]?.tileValue === rowColumn[nextIndex]?.tileValue) {
        const tileValue = rowColumn[currentIndex]?.tileValue + rowColumn[nextIndex]?.tileValue;
        board[indexRow].column[nextIndex].tileValue = tileValue;
        board[indexRow].column[currentIndex].tileValue = null;
        direction === MoveDirection.up ? currentIndex++ : currentIndex--;
        didUpdate = true;
        return moveItemInRow(length, rowColumn, currentIndex, direction, board, indexRow, didUpdate);
    }

    if (rowColumn[currentIndex]?.tileValue === null) {
        direction === MoveDirection.up ? currentIndex-- : currentIndex++;
        return moveItemInRow(length, rowColumn, currentIndex, direction, board, indexRow, didUpdate);
    }
    if (rowColumn[currentIndex]?.tileValue !== null && rowColumn[nextIndex]?.tileValue == null) {
        const tileValue = rowColumn[currentIndex]?.tileValue;
        board[indexRow].column[updateLength].tileValue = tileValue;
        board[indexRow].column[currentIndex].tileValue = null;
        direction === MoveDirection.up ? currentIndex++ : currentIndex--;
        didUpdate = true;
        return moveItemInRow(length, rowColumn, currentIndex, direction, board, indexRow, didUpdate);
    }
}
// update the required column in the selected row in recursive form
export function moveItemInColumn(
    length: number,
    rowColumn: TiledState[],
    currentIndex: number,
    direction: MoveDirection,
    board: Matrix[],
    indexRow: number,
    didUpdate = false
): boolean {
    if (length === 0) {
        return didUpdate;
    }
    let nextIndex = direction === MoveDirection.down ? currentIndex + 1 : currentIndex - 1;
    const updateLength = direction === MoveDirection.down ? currentIndex + length : Math.abs(currentIndex - length);

    if (updateLength < 0 || nextIndex < 0) {
        return didUpdate;
    }
    if (updateLength >= rowColumn.length || nextIndex >= rowColumn.length) {
        return didUpdate;
    }
    if (
        rowColumn[currentIndex]?.tileValue !== null &&
        rowColumn[nextIndex]?.tileValue !== null &&
        rowColumn[currentIndex]?.tileValue !== rowColumn[nextIndex]?.tileValue
    ) {
        return didUpdate;
    }
    if (rowColumn[currentIndex]?.tileValue === null) {
        direction === MoveDirection.up ? currentIndex-- : currentIndex++;

        return moveItemInColumn(length, rowColumn, currentIndex, direction, board, indexRow, didUpdate);
    }
    if (rowColumn[currentIndex]?.tileValue !== null && rowColumn[nextIndex]?.tileValue == null) {
        const tileValue = rowColumn[currentIndex]?.tileValue;

        board[updateLength].column[indexRow].tileValue = tileValue;
        board[currentIndex].column[indexRow].tileValue = null;
        nextIndex = direction === MoveDirection.up ? nextIndex + 1 : nextIndex - 1;

        didUpdate = true;
        return moveItemInColumn(length, rowColumn, nextIndex, direction, board, indexRow, didUpdate);
    }
}
// check if the cell has value and the next cell is empty
export function checkIfIndexIsNotNull(rowColumn: TiledState[], indexColumn: number, nextIndex: number): boolean {
    if (rowColumn[indexColumn]?.tileValue === null) {
        return false;
    }
    if (rowColumn[nextIndex]?.tileValue == null) {
        return true;
    }
    if (rowColumn[indexColumn]?.tileValue !== rowColumn[nextIndex]?.tileValue) {
        return true;
    }
    return false;
}
// get  the next index according to the direction
export function getNextIndex(indexColumn: number, moveDirection: MoveDirection): number {
    return moveDirection === MoveDirection.up ? indexColumn - 1 : indexColumn + 1;
}
// check if previous index is equal
export function checkPreviousIndex(indexColumn: number, rowColumn: TiledState[]): number {
    if (indexColumn === rowColumn.length) {
        return null;
    }
    if (rowColumn[indexColumn]?.tileValue === rowColumn[indexColumn + 1]?.tileValue) {
        const sum = rowColumn[indexColumn]?.tileValue + rowColumn[indexColumn + 1]?.tileValue;
        rowColumn[indexColumn].tileValue = sum;
        rowColumn[indexColumn + 1].tileValue = null;
        return sum;
    }
    return null;
}
