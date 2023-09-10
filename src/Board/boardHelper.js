"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkBoardState = exports.getRandomRowColumNumber = exports.getRandomTileNumber = exports.createRow = exports.updateBoardTilesPosition = exports.printBoard = void 0;
var const_1 = require("../const");
function printBoard(board) {
    var print = [];
    board.forEach(function (item) {
        var colum = [];
        item.column.forEach(function (columItem) {
            colum.push(columItem.tileValue);
        });
        print.push({ row: item.rows, colum: colum });
    });
    console.log(print);
}
exports.printBoard = printBoard;
function updateBoardTilesPosition(board, boardState) {
    boardState.forEach(function (item) {
        var index = const_1.ROWIDMAPER.findIndex(function (i) { return i === item.rowId; });
        board[index].column[item.columNumber].tileValue = item.tileValue;
    });
    printBoard(board);
}
exports.updateBoardTilesPosition = updateBoardTilesPosition;
function createRow(index) {
    var rows = [];
    for (var i = 0; i < 4; i++) {
        rows.push({
            rowId: const_1.ROWIDMAPER[index],
            columNumber: index,
            tileValue: null,
        });
    }
    return rows;
}
exports.createRow = createRow;
//summarize  the number to appearance in the board state.
function findNumberAppearance(boardState) {
    var boardLength = boardState.length;
    var count = boardState.reduce(function (accumulator, currentItem) {
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
function getRandomTileNumber(boardState) {
    if (boardState.length < 1) {
        return 2;
    }
    var numberAppearance = findNumberAppearance(boardState);
    if (numberAppearance < 0.9) {
        return 2;
    }
    return 4;
}
exports.getRandomTileNumber = getRandomTileNumber;
function getRandomRowColumNumber(min, max) {
    // Generate a random decimal number between 0 and 1
    var randomDecimal = Math.random();
    // Scale the random decimal to the desired range (min to max)
    var randomNumber = Math.floor(randomDecimal * (max - min + 1)) + min;
    return randomNumber;
}
exports.getRandomRowColumNumber = getRandomRowColumNumber;
function checkBoardState(board) {
    var ocppiedCellLength = 0;
    board.forEach(function (row) {
        row.column.forEach(function (cell) {
            if ((cell === null || cell === void 0 ? void 0 : cell.tileValue) !== null) {
                ocppiedCellLength++;
            }
        });
    });
    return ocppiedCellLength < 16;
}
exports.checkBoardState = checkBoardState;
