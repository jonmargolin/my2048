import { Board } from '../Board/board';
import { printBoard } from '../Board/boardHelper';
import { VALIDKEY } from '../const';
import { MoveDirection, SearchDirection } from '../types';
import { filterColumNumber } from './gameHelper';

export class Game {
    game: Board;
    constructor() {
        this.game = new Board();
        this.startGame();
    }
    startGame() {
        this.listingToKeyPress();
    }
    // Listen to each key press and  call the requested function for the movement
    listingToKeyPress() {
        if (process.stdin.isTTY) {
            process.stdin.setRawMode(true);
            process.stdin.on('data', (key: Buffer) => {
                if (key.toString() === '\u0003') {
                    // Ctrl+C pressed
                    process.exit();
                }
                if (!VALIDKEY.includes(key.toString())) {
                    console.log('invalided key  press');
                }
                if (this.game.gameOver) {
                    console.log('game over');
                    return;
                }
                if (this.game.score === 2048) {
                    this.game.gameOver = true;
                    console.log('you win game over');
                    return;
                }
                switch (key.toString()) {
                    case 'w': {
                        this.moveUp();
                        break;
                    }
                    case 'a': {
                        this.moveLeft();
                        break;
                    }
                    case 'd': {
                        this.moveRight();
                        break;
                    }
                    case 's': {
                        this.moveDown();
                        break;
                    }
                    default:
                        console.log(`invalid move.`);
                        break;
                }
            });
        }
    }

    moveLeft() {
        const addTile = this.calculateBoardTile(SearchDirection.row, MoveDirection.down);
        if (addTile) {
            this.game.setTilePosition();
        } else {
            printBoard(this.game.board);
            console.log(this.game.score);
        }
    }
    moveRight() {
        const addTile = this.calculateBoardTile(SearchDirection.row, MoveDirection.up);
        if (addTile) {
            this.game.setTilePosition();
        } else {
            printBoard(this.game.board);
            console.log(this.game.score);
        }
    }
    moveUp() {
        const addTile = this.calculateBoardTile(SearchDirection.column, MoveDirection.up);
        if (addTile) {
            this.game.setTilePosition();
        } else {
            printBoard(this.game.board);
            console.log(this.game.score);
        }
    }

    moveDown() {
        const addTile = this.calculateBoardTile(SearchDirection.column, MoveDirection.down);
        if (addTile) {
            this.game.setTilePosition();
        } else {
            printBoard(this.game.board);
            console.log(this.game.score);
        }
    }
    calculateBoardTile(searchDirection: SearchDirection, mergeDirection: MoveDirection): boolean {
        const board = searchDirection === SearchDirection.row ? this.game.board : filterColumNumber(this.game.board);
        let cellsChanges = false;
        cellsChanges = this.game.moveColumTile(mergeDirection, board, searchDirection);

        return cellsChanges;
    }
}
