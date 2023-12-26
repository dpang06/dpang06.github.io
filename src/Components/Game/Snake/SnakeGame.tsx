import SnakeBoard from "./SnakeBoard";
import {Point, Direction, UP, DOWN, LEFT, RIGHT} from "./util";

const keyToDir: { [key: string]: Direction } = {
    "ArrowUp": UP,
    "ArrowDown": DOWN,
    "ArrowLeft": LEFT,
    "ArrowRight": RIGHT,
};

export default class SnakeGame {
    board: SnakeBoard;
    fps: number;
    div: { x: number, y: number };
    arr: Point[] = []; // store the body, as a (reversed) queue
    dir = UP; // direction of move
    occupied: Array<Array<boolean>>;
    food: Point = { x: -1, y: -1 };
    turns: Direction[] = [];
    gameLoop: NodeJS.Timer | null = null;
    onStateChange: (state: string) => void;

    constructor(board: SnakeBoard,
        div: { x: number, y: number }, speed: number,
        onStateChange: (state: string) => void,
        onGameReset: () => void) {
        this.board = board;
        this.board.clear();
        this.board.setGridDiv(div);
        this.board.onKeydown((ev: KeyboardEvent) => {
            if (ev.key in keyToDir) {
                ev.preventDefault();
                this.turn(keyToDir[ev.key]);
            } else if (ev.key === "r") {
                ev.preventDefault();
                this.stop();
                onGameReset();
            }
        });

        this.fps = 1000 / speed; // speed = grid per 1000ms

        this.div = div;
        this.occupied = [];
        for (let i = 0; i < div.x; i++) {
            let temp = new Array(div.y);
            temp.fill(false);
            this.occupied.push(temp);
        }

        this.onStateChange = onStateChange;
        this.display("Playing...");

        // Starting point
        this.arr = [{ x: Math.floor(div.x / 2), y: Math.floor(div.y / 2) }];
        this.occupied[this.arr[0].x][this.arr[0].y] = true;
        // console.log(div, copy(this.arr), this.dir);
        this.board.drawHead(this.arr[0].x, this.arr[0].y, this.dir);

        this.generateFood();
    }
    display(s: string) {
        this.onStateChange(s);
    }
    isOccupied(point: { x: number, y: number }) {
        return this.occupied[point.x][point.y];
    };
    generateFood() {
        // search empty space
        let food: Point = { x: -1, y: -1 };
        do {
            food.x = Math.floor(this.div.x * Math.random());
            food.y = Math.floor(this.div.y * Math.random());
        } while (this.isOccupied(food));
        this.food = food;
        this.board.drawFood(food.x, food.y);
    };

    isInside(point: Point) {
        let div = this.div;
        let { x, y } = point;
        return (0 <= x) && (x < div.x) && (0 <= y) && (y < div.y);
    };

    move() {
        // console.log(this.arr);
        let head: Point, tail: Point;
        let dir = this.dir;
        let food = this.food;

        // turn head
        head = this.arr[0];
        this.board.clearPixel(head.x, head.y);
        this.board.drawHead(head.x, head.y, dir);

        let next = { x: head.x + dir.x, y: head.y + dir.y };
        if (!this.isInside(next)) {
            return false;
        }
        if (food.x === next.x && food.y === next.y) { // eat!
            this.board.clearPixel(food.x, food.y);

            this.arr.unshift(next);
            this.occupied[next.x][next.y] = true;
            this.board.drawHead(next.x, next.y, dir);
            this.board.drawBody(head.x, head.y);
            if (this.arr.length === this.div.x * this.div.y) {
                return true;
            }
            this.generateFood();
        } else {
            if (this.isOccupied(next)) {
                return false;
            }
            tail = this.arr.pop()!;
            this.occupied[tail.x][tail.y] = false;
            this.board.clearPixel(tail.x, tail.y);
            this.arr.unshift(next);
            this.occupied[next.x][next.y] = true;
            this.board.drawHead(next.x, next.y, dir);
            if (this.arr.length > 1) {
                this.board.drawBody(head.x, head.y);
            }
        }
        return null;
    };

    turn(dir: Direction) {
        this.turns.push(dir);
    };

    frame() {
        //
        // Read turn command
        //
        // Option A: break every time when a valid command is read
        // => The snake will run at least one grid for every valid turn
        // => if there is a bunch of commands with slow fps, the new commands cannot be read immediately
        //
        // Option B: only read the last valid command in command queue
        // => A bunch of commands will be ignored.
        // => A "fast" turn may become invalid
        //
        // All have trade-offs, and there should be other more complex algorithms
        //
        while (this.turns.length > 0) {
            let turn: Direction = this.turns.shift()!;
            if (this.dir.next?.has(turn)) {
                this.dir = turn;
                console.log("turn to " + turn.name);
                // break;
            } else {
                console.log("skip turn to " + turn.name);
            }
        }

        //
        // move
        //
        let result = this.move();
        if (result !== null) {
            if (result === true) {
                this.display("Congratulations! You win!!!!");
            } else { //if (result === false) {
                this.display("You lose!");
            }
            this.stop();
        }
    }

    start() {
        this.gameLoop = setInterval(this.frame.bind(this), this.fps);
    };

    stop() {
        clearInterval(this.gameLoop!);
    };

};