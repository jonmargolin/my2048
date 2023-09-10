import {
    getNextIndex,
    checkIfIndexIsNotNull,
    findEmptyTitle,
    moveItemInRow,
    findFirstIndexNotNull,
    checkPreviousIndex,
    moveItemInColumn,
    updateColumnInRow,
    updateRowInColumn,
} from '../Game/gameHelper';
import { ROWIDMAPER } from '../const';
import { Matrix, MoveDirection, SearchDirection, TiledState } from '../types';
import { checkBoardState, createRow, getRandomRowColumNumber, getRandomTileNumber, printBoard, updateBoardTilesPosition } from './boardHelper';

export class Board {
    board: Matrix[];
    score: number;
    initialTiles: number[];
    boardState: TiledState[];
    currentTile: TiledState;
    gameOver: boolean;
    constructor() {
        this.board = [];
        this.boardState = [];
        this.gameOver = false;
        this.score = 0;
        this.initialTiles = [getRandomTileNumber(this.boardState), getRandomTileNumber(this.boardState)];
        this.createBoard();
        this.setTileInitialPosition();
    }
    private createBoard() {
        // Create  a Borad  with  4 colums and 4 rows
        for (let index = 0; index < 4; index++) {
            const column = createRow(index);

            this.board.push({
                rows: ROWIDMAPER[index],
                column: column,
            });
        }
    }

    // add new tile to the board state.
    // check if  the score is equal or less then  2048
    // create an new title candidate  and  check if all ready exists in the board if not  add it to the board state
    setTilePosition(doPrint = true) {
        if (this.score >= 2048) {
            console.log('you win game over');
            return;
        }
        if (checkBoardState(this.board)) {
            let isCellEmpty = true;

            while (isCellEmpty) {
                const newTileCandidate = {
                    rowId: ROWIDMAPER[getRandomRowColumNumber(0, 3)],
                    columNumber: getRandomRowColumNumber(0, 3),
                    tileValue: getRandomTileNumber(this.boardState),
                };
                const index = ROWIDMAPER.findIndex((i) => i === newTileCandidate.rowId);
                if (this.board[index].column[newTileCandidate.columNumber].tileValue === null) {
                    isCellEmpty = false;
                    this.board[index].column[newTileCandidate.columNumber].tileValue = newTileCandidate.tileValue;
                }
            }
            if (doPrint) {
                printBoard(this.board);
                console.log('score:', this.score);
            }
        } else {
            this.gameOver = true;
        }
    }
    // set  initial  first two  tiles.
    private setTileInitialPosition() {
        for (let index = 0; index < 2; index++) {
            this.setTilePosition(false);
        }
        printBoard(this.board);
    }

    // move  the row/column to the rules.
    // if the  cell and next cell is equal add  the sum  of both cells to the next tiles,
    // if  the next cell is null move the tile to next tile.
    // all  the tiles in the row/column is occupied don't change anything.
    moveColumTile(mergeDirection: MoveDirection, board: Matrix[], direction: SearchDirection): boolean {
        let cellsChanges = false;
        for (let indexRow = 0; indexRow < board.length; indexRow++) {
            const rowColumn = board[indexRow].column;

            for (let indexColumn = 0; indexColumn < rowColumn.length; indexColumn++) {
                const nextIndex = getNextIndex(indexColumn, mergeDirection);
                if (nextIndex > rowColumn.length) {
                    break;
                }
                if (checkIfIndexIsNotNull(rowColumn, indexColumn, nextIndex)) {
                    const length = findEmptyTitle(rowColumn, indexColumn, 0, mergeDirection, direction);
                    if (direction === SearchDirection.row) {
                        const didUpdate = moveItemInRow(length, rowColumn, indexColumn, mergeDirection, board, indexRow);
                        if (didUpdate) {
                            cellsChanges = true;
                            const indexToUpdate = findFirstIndexNotNull(rowColumn);
                            const firstIndexToUpdateLength = findEmptyTitle(rowColumn, indexToUpdate, 0, mergeDirection, direction);
                            moveItemInRow(firstIndexToUpdateLength, rowColumn, indexToUpdate, mergeDirection, board, indexRow);
                        }
                    }
                    if (direction === SearchDirection.column) {
                        if (mergeDirection === MoveDirection.up) {
                            const sum = checkPreviousIndex(indexColumn, rowColumn);
                            if (sum !== null) {
                                this.score = this.score + sum;
                            }
                        }
                        const didUpdate = moveItemInColumn(length, rowColumn, indexColumn, mergeDirection, this.board, indexRow);
                        if (didUpdate) {
                            cellsChanges = true;
                            let updateColumns = true;
                            while (updateColumns === true) {
                                const indexToUpdate = findFirstIndexNotNull(rowColumn);
                                if (indexToUpdate === undefined || indexToUpdate === 0) {
                                    updateColumns = false;
                                }
                                const firstIndexToUpdateLength = findEmptyTitle(rowColumn, indexToUpdate, 0, mergeDirection, direction);
                                moveItemInColumn(firstIndexToUpdateLength, rowColumn, indexToUpdate, mergeDirection, this.board, indexRow);
                                if (firstIndexToUpdateLength === 0) {
                                    updateColumns = false;
                                }
                            }
                        }
                    }
                }

                if (
                    rowColumn[indexColumn]?.tileValue !== null &&
                    rowColumn[nextIndex]?.tileValue !== null &&
                    rowColumn[indexColumn]?.tileValue === rowColumn[nextIndex]?.tileValue
                ) {
                    const sum = rowColumn[indexColumn]?.tileValue + rowColumn[nextIndex]?.tileValue;
                    this.score = this.score + sum;
                    if (mergeDirection === MoveDirection.up && direction === SearchDirection.row) {
                        this.board[indexRow].column[nextIndex].tileValue = sum;
                    }
                    if (mergeDirection === MoveDirection.down && direction === SearchDirection.row) {
                        this.board[indexRow].column[indexColumn].tileValue = sum;
                        this.board[indexRow].column[nextIndex].tileValue = null;
                        const updateIndex = findFirstIndexNotNull(rowColumn);
                        const emptyLength = findEmptyTitle(rowColumn, updateIndex, 0, mergeDirection, direction);
                        updateColumnInRow(emptyLength, rowColumn, updateIndex, mergeDirection, board, indexRow);
                    }
                    if (mergeDirection === MoveDirection.down && direction === SearchDirection.column) {
                        this.board[indexColumn].column[indexRow].tileValue = sum;
                        this.board[nextIndex].column[indexRow].tileValue = null;
                        const updateindex = findFirstIndexNotNull(rowColumn);
                        const emptyLength = findEmptyTitle(rowColumn, updateindex, 0, mergeDirection, direction);
                        updateRowInColumn(emptyLength, rowColumn, updateindex, mergeDirection, this.board, indexRow);
                    }
                    if (mergeDirection === MoveDirection.up && direction === SearchDirection.column) {
                        this.board[indexColumn].column[indexRow].tileValue = null;
                        this.board[nextIndex].column[indexRow].tileValue = sum;
                        const updateindex = findFirstIndexNotNull(rowColumn);
                        const emptyLength = findEmptyTitle(rowColumn, updateindex, 0, mergeDirection, direction);
                        updateRowInColumn(emptyLength, rowColumn, updateindex, mergeDirection, this.board, indexRow);
                    }
                    cellsChanges = true;
                }
            }
        }

        return cellsChanges;
    }
}
