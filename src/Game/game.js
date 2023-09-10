"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Game = void 0;
var board_1 = require("../Board/board");
var boardHelper_1 = require("../Board/boardHelper");
var const_1 = require("../const");
var types_1 = require("../types");
var gameHelper_1 = require("./gameHelper");
var Game = /** @class */ (function () {
    function Game() {
        this.game = new board_1.Board();
        this.startGame();
    }
    Game.prototype.startGame = function () {
        this.listingToKeyPress();
    };
    // Listen to each key press and  call the requested function for the movement
    Game.prototype.listingToKeyPress = function () {
        var _this = this;
        if (process.stdin.isTTY) {
            process.stdin.setRawMode(true);
            process.stdin.on('data', function (key) {
                if (key.toString() === '\u0003') {
                    // Ctrl+C pressed
                    process.exit();
                }
                if (!const_1.VALIDKEY.includes(key.toString())) {
                    console.log('invalided key  press');
                }
                if (_this.game.gameOver) {
                    console.log('game over');
                    return;
                }
                if (_this.game.score === 2048) {
                    _this.game.gameOver = true;
                    console.log('you win game over');
                    return;
                }
                switch (key.toString()) {
                    case 'w': {
                        _this.moveUp();
                        break;
                    }
                    case 'a': {
                        _this.moveLeft();
                        break;
                    }
                    case 'd': {
                        _this.moveRight();
                        break;
                    }
                    case 's': {
                        _this.moveDown();
                        break;
                    }
                    default:
                        console.log("invalid move.");
                        break;
                }
            });
        }
    };
    Game.prototype.moveLeft = function () {
        var addTile = this.calculateBoardTile(types_1.SearchDirection.row, types_1.MoveDirection.down);
        if (addTile) {
            this.game.setTilePosition();
        }
        else {
            (0, boardHelper_1.printBoard)(this.game.board);
            console.log(this.game.score);
        }
    };
    Game.prototype.moveRight = function () {
        var addTile = this.calculateBoardTile(types_1.SearchDirection.row, types_1.MoveDirection.up);
        if (addTile) {
            this.game.setTilePosition();
        }
        else {
            (0, boardHelper_1.printBoard)(this.game.board);
            console.log(this.game.score);
        }
    };
    Game.prototype.moveUp = function () {
        var addTile = this.calculateBoardTile(types_1.SearchDirection.column, types_1.MoveDirection.up);
        if (addTile) {
            this.game.setTilePosition();
        }
        else {
            (0, boardHelper_1.printBoard)(this.game.board);
            console.log(this.game.score);
        }
    };
    Game.prototype.moveDown = function () {
        var addTile = this.calculateBoardTile(types_1.SearchDirection.column, types_1.MoveDirection.down);
        if (addTile) {
            this.game.setTilePosition();
        }
        else {
            (0, boardHelper_1.printBoard)(this.game.board);
            console.log(this.game.score);
        }
    };
    Game.prototype.calculateBoardTile = function (searchDirection, mergeDirection) {
        var board = searchDirection === types_1.SearchDirection.row ? this.game.board : (0, gameHelper_1.filterColumNumber)(this.game.board);
        var cellsChanges = false;
        cellsChanges = this.game.moveColumTile(mergeDirection, board, searchDirection);
        return cellsChanges;
    };
    return Game;
}());
exports.Game = Game;
