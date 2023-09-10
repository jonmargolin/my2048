"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Board = void 0;
var gameHelper_1 = require("../Game/gameHelper");
var const_1 = require("../const");
var types_1 = require("../types");
var boardHelper_1 = require("./boardHelper");
var Board = /** @class */ (function () {
    function Board() {
        this.board = [];
        this.boardState = [];
        this.gameOver = false;
        this.score = 0;
        this.initialTiles = [(0, boardHelper_1.getRandomTileNumber)(this.boardState), (0, boardHelper_1.getRandomTileNumber)(this.boardState)];
        this.createBoard();
        this.setTileInitialPosition();
    }
    Board.prototype.createBoard = function () {
        // Create  a Borad  with  4 colums and 4 rows
        for (var index = 0; index < 4; index++) {
            var column = (0, boardHelper_1.createRow)(index);
            this.board.push({
                rows: const_1.ROWIDMAPER[index],
                column: column,
            });
        }
    };
    // add new tile to the board state.
    // check if  the score is equal or less then  2048
    // create an new title candidate  and  check if all ready exists in the board if not  add it to the board state
    Board.prototype.setTilePosition = function (doPrint) {
        if (doPrint === void 0) { doPrint = true; }
        if (this.score >= 2048) {
            console.log('you win game over');
            return;
        }
        if ((0, boardHelper_1.checkBoardState)(this.board)) {
            var isCellEmpty = true;
            var _loop_1 = function () {
                var newTileCandidate = {
                    rowId: const_1.ROWIDMAPER[(0, boardHelper_1.getRandomRowColumNumber)(0, 3)],
                    columNumber: (0, boardHelper_1.getRandomRowColumNumber)(0, 3),
                    tileValue: (0, boardHelper_1.getRandomTileNumber)(this_1.boardState),
                };
                var index = const_1.ROWIDMAPER.findIndex(function (i) { return i === newTileCandidate.rowId; });
                if (this_1.board[index].column[newTileCandidate.columNumber].tileValue === null) {
                    isCellEmpty = false;
                    this_1.board[index].column[newTileCandidate.columNumber].tileValue = newTileCandidate.tileValue;
                }
            };
            var this_1 = this;
            while (isCellEmpty) {
                _loop_1();
            }
            if (doPrint) {
                (0, boardHelper_1.printBoard)(this.board);
                console.log('score:', this.score);
            }
        }
        else {
            this.gameOver = true;
        }
    };
    // set  initial  first two  tiles.
    Board.prototype.setTileInitialPosition = function () {
        for (var index = 0; index < 2; index++) {
            this.setTilePosition(false);
        }
        (0, boardHelper_1.printBoard)(this.board);
    };
    // move  the row/column to the rules.
    // if the  cell and next cell is equal add  the sum  of both cells to the next tiles,
    // if  the next cell is null move the tile to next tile.
    // all  the tiles in the row/column is occupied don't change anything.
    Board.prototype.moveColumTile = function (mergeDirection, board, direction) {
        var _a, _b, _c, _d, _e, _f;
        var cellsChanges = false;
        for (var indexRow = 0; indexRow < board.length; indexRow++) {
            var rowColumn = board[indexRow].column;
            for (var indexColumn = 0; indexColumn < rowColumn.length; indexColumn++) {
                var nextIndex = (0, gameHelper_1.getNextIndex)(indexColumn, mergeDirection);
                if (nextIndex > rowColumn.length) {
                    break;
                }
                if ((0, gameHelper_1.checkIfIndexIsNotNull)(rowColumn, indexColumn, nextIndex)) {
                    var length_1 = (0, gameHelper_1.findEmptyTitle)(rowColumn, indexColumn, 0, mergeDirection, direction);
                    if (direction === types_1.SearchDirection.row) {
                        var didUpdate = (0, gameHelper_1.moveItemInRow)(length_1, rowColumn, indexColumn, mergeDirection, board, indexRow);
                        if (didUpdate) {
                            cellsChanges = true;
                            var indexToUpdate = (0, gameHelper_1.findFirstIndexNotNull)(rowColumn);
                            var firstIndexToUpdateLength = (0, gameHelper_1.findEmptyTitle)(rowColumn, indexToUpdate, 0, mergeDirection, direction);
                            (0, gameHelper_1.moveItemInRow)(firstIndexToUpdateLength, rowColumn, indexToUpdate, mergeDirection, board, indexRow);
                        }
                    }
                    if (direction === types_1.SearchDirection.column) {
                        if (mergeDirection === types_1.MoveDirection.up) {
                            var sum = (0, gameHelper_1.checkPreviousIndex)(indexColumn, rowColumn);
                            if (sum !== null) {
                                this.score = this.score + sum;
                            }
                        }
                        var didUpdate = (0, gameHelper_1.moveItemInColumn)(length_1, rowColumn, indexColumn, mergeDirection, this.board, indexRow);
                        if (didUpdate) {
                            cellsChanges = true;
                            var updateColumns = true;
                            while (updateColumns === true) {
                                var indexToUpdate = (0, gameHelper_1.findFirstIndexNotNull)(rowColumn);
                                if (indexToUpdate === undefined || indexToUpdate === 0) {
                                    updateColumns = false;
                                }
                                var firstIndexToUpdateLength = (0, gameHelper_1.findEmptyTitle)(rowColumn, indexToUpdate, 0, mergeDirection, direction);
                                (0, gameHelper_1.moveItemInColumn)(firstIndexToUpdateLength, rowColumn, indexToUpdate, mergeDirection, this.board, indexRow);
                                if (firstIndexToUpdateLength === 0) {
                                    updateColumns = false;
                                }
                            }
                        }
                    }
                }
                if (((_a = rowColumn[indexColumn]) === null || _a === void 0 ? void 0 : _a.tileValue) !== null &&
                    ((_b = rowColumn[nextIndex]) === null || _b === void 0 ? void 0 : _b.tileValue) !== null &&
                    ((_c = rowColumn[indexColumn]) === null || _c === void 0 ? void 0 : _c.tileValue) === ((_d = rowColumn[nextIndex]) === null || _d === void 0 ? void 0 : _d.tileValue)) {
                    var sum = ((_e = rowColumn[indexColumn]) === null || _e === void 0 ? void 0 : _e.tileValue) + ((_f = rowColumn[nextIndex]) === null || _f === void 0 ? void 0 : _f.tileValue);
                    this.score = this.score + sum;
                    if (mergeDirection === types_1.MoveDirection.up && direction === types_1.SearchDirection.row) {
                        this.board[indexRow].column[nextIndex].tileValue = sum;
                    }
                    if (mergeDirection === types_1.MoveDirection.down && direction === types_1.SearchDirection.row) {
                        this.board[indexRow].column[indexColumn].tileValue = sum;
                        this.board[indexRow].column[nextIndex].tileValue = null;
                        var updateIndex = (0, gameHelper_1.findFirstIndexNotNull)(rowColumn);
                        var emptyLength = (0, gameHelper_1.findEmptyTitle)(rowColumn, updateIndex, 0, mergeDirection, direction);
                        (0, gameHelper_1.updateColumnInRow)(emptyLength, rowColumn, updateIndex, mergeDirection, board, indexRow);
                    }
                    if (mergeDirection === types_1.MoveDirection.down && direction === types_1.SearchDirection.column) {
                        this.board[indexColumn].column[indexRow].tileValue = sum;
                        this.board[nextIndex].column[indexRow].tileValue = null;
                        var updateindex = (0, gameHelper_1.findFirstIndexNotNull)(rowColumn);
                        var emptyLength = (0, gameHelper_1.findEmptyTitle)(rowColumn, updateindex, 0, mergeDirection, direction);
                        (0, gameHelper_1.updateRowInColumn)(emptyLength, rowColumn, updateindex, mergeDirection, this.board, indexRow);
                    }
                    if (mergeDirection === types_1.MoveDirection.up && direction === types_1.SearchDirection.column) {
                        this.board[indexColumn].column[indexRow].tileValue = null;
                        this.board[nextIndex].column[indexRow].tileValue = sum;
                        var updateindex = (0, gameHelper_1.findFirstIndexNotNull)(rowColumn);
                        var emptyLength = (0, gameHelper_1.findEmptyTitle)(rowColumn, updateindex, 0, mergeDirection, direction);
                        (0, gameHelper_1.updateRowInColumn)(emptyLength, rowColumn, updateindex, mergeDirection, this.board, indexRow);
                    }
                    cellsChanges = true;
                }
            }
        }
        return cellsChanges;
    };
    return Board;
}());
exports.Board = Board;
