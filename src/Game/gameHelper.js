"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkPreviousIndex = exports.getNextIndex = exports.checkIfIndexIsNotNull = exports.moveItemInColumn = exports.moveItemInRow = exports.updateColumnInRow = exports.updateRowInColumn = exports.findFirstIndexNotNull = exports.findEmptyTitle = exports.filterByRowId = exports.filterColumNumber = void 0;
var const_1 = require("../const");
var types_1 = require("../types");
// filter the board state according to colum and sort it in descending order
function filterColumNumber(board) {
    var updateBoard = [];
    for (var index = 0; index < board.length; index++) {
        var boardLength = 0;
        var columArray = [];
        while (boardLength < board.length) {
            columArray.push(board[boardLength].column[index]);
            boardLength++;
        }
        updateBoard.push({ rows: const_1.ROWIDMAPER[index], column: columArray });
    }
    return updateBoard;
}
exports.filterColumNumber = filterColumNumber;
// filter the board state according to row state sort it in descending order
function filterByRowId(boardState, searchDirection, columIndex, mergeDirection) {
    var colum = boardState.filter(function (currentColum) {
        var rowId = const_1.ROWIDMAPER.indexOf(currentColum[searchDirection]);
        if (rowId === columIndex) {
            return currentColum;
        }
    });
    colum.sort(function (a, b) { return a.columNumber - b.columNumber; });
    if (mergeDirection === 'down') {
        colum.reverse();
    }
    return colum;
}
exports.filterByRowId = filterByRowId;
// the length to the nernst empty tile.
function findEmptyTitle(rowColumn, currentIndex, length, direction, searchDirection) {
    var _a, _b;
    var nextIndex = 0;
    if (searchDirection === types_1.SearchDirection.row) {
        nextIndex = direction === types_1.MoveDirection.up ? currentIndex + 1 : currentIndex - 1;
    }
    if (searchDirection === types_1.SearchDirection.column) {
        nextIndex = direction === types_1.MoveDirection.down ? currentIndex + 1 : currentIndex - 1;
    }
    if (nextIndex > rowColumn.length) {
        return length;
    }
    if (nextIndex < 0) {
        return length;
    }
    if (((_a = rowColumn[nextIndex]) === null || _a === void 0 ? void 0 : _a.tileValue) === null && rowColumn.length > currentIndex) {
        return findEmptyTitle(rowColumn, nextIndex, length + 1, direction, searchDirection);
    }
    if (((_b = rowColumn[nextIndex]) === null || _b === void 0 ? void 0 : _b.tileValue) !== null) {
        return length;
    }
}
exports.findEmptyTitle = findEmptyTitle;
// find the index of the first cell with value
function findFirstIndexNotNull(rowColumn) {
    var _a, _b;
    for (var index = 0; index <= rowColumn.length - 1; index++) {
        if (((_a = rowColumn[index]) === null || _a === void 0 ? void 0 : _a.tileValue) != null && ((_b = rowColumn[index + 1]) === null || _b === void 0 ? void 0 : _b.tileValue) === null) {
            return index;
        }
    }
    return undefined;
}
exports.findFirstIndexNotNull = findFirstIndexNotNull;
// update the required column in the selected row.
function updateRowInColumn(length, rowColumn, currentIndex, direction, board, indexRow) {
    var _a, _b, _c;
    if (length === 0) {
        return;
    }
    var nextIndex = direction === types_1.MoveDirection.up ? currentIndex - 1 : currentIndex + 1;
    var updateLength = direction === types_1.MoveDirection.up ? length - currentIndex : currentIndex + length;
    if (nextIndex > rowColumn.length) {
        return;
    }
    if (nextIndex < 0 || updateLength < 0) {
        return;
    }
    if (((_a = rowColumn[currentIndex]) === null || _a === void 0 ? void 0 : _a.tileValue) !== null && ((_b = rowColumn[nextIndex]) === null || _b === void 0 ? void 0 : _b.tileValue) == null) {
        var tileValue = (_c = rowColumn[currentIndex]) === null || _c === void 0 ? void 0 : _c.tileValue;
        board[updateLength].column[indexRow].tileValue = tileValue;
        board[currentIndex].column[indexRow].tileValue = null;
    }
}
exports.updateRowInColumn = updateRowInColumn;
// update the required row in the selected column.
function updateColumnInRow(length, rowColumn, currentIndex, direction, board, indexRow) {
    var _a, _b, _c, _d;
    if (length === 0) {
        return;
    }
    var nextIndex = direction === types_1.MoveDirection.up ? currentIndex + 1 : currentIndex - 1;
    var updateLength = direction === types_1.MoveDirection.up ? length + currentIndex : currentIndex - length;
    if (nextIndex > rowColumn.length) {
        return;
    }
    if (nextIndex < 0 || updateLength < 0) {
        return;
    }
    if (((_a = rowColumn[currentIndex]) === null || _a === void 0 ? void 0 : _a.tileValue) === null) {
        direction === types_1.MoveDirection.up ? currentIndex++ : currentIndex--;
        return updateColumnInRow(length, rowColumn, currentIndex, direction, board, indexRow);
    }
    if (((_b = rowColumn[currentIndex]) === null || _b === void 0 ? void 0 : _b.tileValue) !== null && ((_c = rowColumn[nextIndex]) === null || _c === void 0 ? void 0 : _c.tileValue) == null) {
        var tileValue = (_d = rowColumn[currentIndex]) === null || _d === void 0 ? void 0 : _d.tileValue;
        board[indexRow].column[updateLength].tileValue = tileValue;
        board[indexRow].column[currentIndex].tileValue = null;
        direction === types_1.MoveDirection.up ? currentIndex++ : currentIndex--;
        return updateColumnInRow(length, rowColumn, currentIndex, direction, board, indexRow);
    }
}
exports.updateColumnInRow = updateColumnInRow;
// update the required row in the selected column in recursive form
function moveItemInRow(length, rowColumn, currentIndex, direction, board, indexRow, didUpdate) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o;
    if (didUpdate === void 0) { didUpdate = false; }
    if (length === 0) {
        return didUpdate;
    }
    var nextIndex = direction === types_1.MoveDirection.up ? currentIndex + 1 : currentIndex - 1;
    var updateLength = direction === types_1.MoveDirection.up ? Math.abs(length + currentIndex) : currentIndex - length;
    if (length > rowColumn.length || length < 0) {
        return didUpdate;
    }
    if (updateLength < 0 || currentIndex < 0) {
        return didUpdate;
    }
    if (updateLength >= rowColumn.length || currentIndex >= rowColumn.length) {
        return didUpdate;
    }
    if (((_a = rowColumn[currentIndex]) === null || _a === void 0 ? void 0 : _a.tileValue) !== null &&
        ((_b = rowColumn[nextIndex]) === null || _b === void 0 ? void 0 : _b.tileValue) !== null &&
        ((_c = rowColumn[currentIndex]) === null || _c === void 0 ? void 0 : _c.tileValue) !== ((_d = rowColumn[nextIndex]) === null || _d === void 0 ? void 0 : _d.tileValue)) {
        return didUpdate;
    }
    if (((_e = rowColumn[currentIndex]) === null || _e === void 0 ? void 0 : _e.tileValue) !== null && ((_f = rowColumn[currentIndex]) === null || _f === void 0 ? void 0 : _f.tileValue) === ((_g = rowColumn[nextIndex]) === null || _g === void 0 ? void 0 : _g.tileValue)) {
        var tileValue = ((_h = rowColumn[currentIndex]) === null || _h === void 0 ? void 0 : _h.tileValue) + ((_j = rowColumn[nextIndex]) === null || _j === void 0 ? void 0 : _j.tileValue);
        board[indexRow].column[nextIndex].tileValue = tileValue;
        board[indexRow].column[currentIndex].tileValue = null;
        direction === types_1.MoveDirection.up ? currentIndex++ : currentIndex--;
        didUpdate = true;
        return moveItemInRow(length, rowColumn, currentIndex, direction, board, indexRow, didUpdate);
    }
    if (((_k = rowColumn[currentIndex]) === null || _k === void 0 ? void 0 : _k.tileValue) === null) {
        direction === types_1.MoveDirection.up ? currentIndex-- : currentIndex++;
        return moveItemInRow(length, rowColumn, currentIndex, direction, board, indexRow, didUpdate);
    }
    if (((_l = rowColumn[currentIndex]) === null || _l === void 0 ? void 0 : _l.tileValue) !== null && ((_m = rowColumn[nextIndex]) === null || _m === void 0 ? void 0 : _m.tileValue) == null) {
        var tileValue = (_o = rowColumn[currentIndex]) === null || _o === void 0 ? void 0 : _o.tileValue;
        board[indexRow].column[updateLength].tileValue = tileValue;
        board[indexRow].column[currentIndex].tileValue = null;
        direction === types_1.MoveDirection.up ? currentIndex++ : currentIndex--;
        didUpdate = true;
        return moveItemInRow(length, rowColumn, currentIndex, direction, board, indexRow, didUpdate);
    }
}
exports.moveItemInRow = moveItemInRow;
// update the required column in the selected row in recursive form
function moveItemInColumn(length, rowColumn, currentIndex, direction, board, indexRow, didUpdate) {
    var _a, _b, _c, _d, _e, _f, _g, _h;
    if (didUpdate === void 0) { didUpdate = false; }
    if (length === 0) {
        return didUpdate;
    }
    var nextIndex = direction === types_1.MoveDirection.down ? currentIndex + 1 : currentIndex - 1;
    var updateLength = direction === types_1.MoveDirection.down ? currentIndex + length : Math.abs(currentIndex - length);
    if (updateLength < 0 || nextIndex < 0) {
        return didUpdate;
    }
    if (updateLength >= rowColumn.length || nextIndex >= rowColumn.length) {
        return didUpdate;
    }
    if (((_a = rowColumn[currentIndex]) === null || _a === void 0 ? void 0 : _a.tileValue) !== null &&
        ((_b = rowColumn[nextIndex]) === null || _b === void 0 ? void 0 : _b.tileValue) !== null &&
        ((_c = rowColumn[currentIndex]) === null || _c === void 0 ? void 0 : _c.tileValue) !== ((_d = rowColumn[nextIndex]) === null || _d === void 0 ? void 0 : _d.tileValue)) {
        return didUpdate;
    }
    if (((_e = rowColumn[currentIndex]) === null || _e === void 0 ? void 0 : _e.tileValue) === null) {
        direction === types_1.MoveDirection.up ? currentIndex-- : currentIndex++;
        return moveItemInColumn(length, rowColumn, currentIndex, direction, board, indexRow, didUpdate);
    }
    if (((_f = rowColumn[currentIndex]) === null || _f === void 0 ? void 0 : _f.tileValue) !== null && ((_g = rowColumn[nextIndex]) === null || _g === void 0 ? void 0 : _g.tileValue) == null) {
        var tileValue = (_h = rowColumn[currentIndex]) === null || _h === void 0 ? void 0 : _h.tileValue;
        board[updateLength].column[indexRow].tileValue = tileValue;
        board[currentIndex].column[indexRow].tileValue = null;
        nextIndex = direction === types_1.MoveDirection.up ? nextIndex + 1 : nextIndex - 1;
        didUpdate = true;
        return moveItemInColumn(length, rowColumn, nextIndex, direction, board, indexRow, didUpdate);
    }
}
exports.moveItemInColumn = moveItemInColumn;
// check if the cell has value and the next cell is empty
function checkIfIndexIsNotNull(rowColumn, indexColumn, nextIndex) {
    var _a, _b, _c, _d;
    if (((_a = rowColumn[indexColumn]) === null || _a === void 0 ? void 0 : _a.tileValue) === null) {
        return false;
    }
    if (((_b = rowColumn[nextIndex]) === null || _b === void 0 ? void 0 : _b.tileValue) == null) {
        return true;
    }
    if (((_c = rowColumn[indexColumn]) === null || _c === void 0 ? void 0 : _c.tileValue) !== ((_d = rowColumn[nextIndex]) === null || _d === void 0 ? void 0 : _d.tileValue)) {
        return true;
    }
    return false;
}
exports.checkIfIndexIsNotNull = checkIfIndexIsNotNull;
// get  the next index according to the direction
function getNextIndex(indexColumn, moveDirection) {
    return moveDirection === types_1.MoveDirection.up ? indexColumn - 1 : indexColumn + 1;
}
exports.getNextIndex = getNextIndex;
// check if previous index is equal
function checkPreviousIndex(indexColumn, rowColumn) {
    var _a, _b, _c, _d;
    if (indexColumn === rowColumn.length) {
        return null;
    }
    if (((_a = rowColumn[indexColumn]) === null || _a === void 0 ? void 0 : _a.tileValue) === ((_b = rowColumn[indexColumn + 1]) === null || _b === void 0 ? void 0 : _b.tileValue)) {
        var sum = ((_c = rowColumn[indexColumn]) === null || _c === void 0 ? void 0 : _c.tileValue) + ((_d = rowColumn[indexColumn + 1]) === null || _d === void 0 ? void 0 : _d.tileValue);
        rowColumn[indexColumn].tileValue = sum;
        rowColumn[indexColumn + 1].tileValue = null;
        return sum;
    }
    return null;
}
exports.checkPreviousIndex = checkPreviousIndex;
