/*jshint esversion: 6 */

const UP = { name: "up", x: 0, y: -1 };
const DOWN = { name: "down", x: 0, y: 1 };
const LEFT = { name: "left", x: -1, y: 0 };
const RIGHT = { name: "right", x: 1, y: 0 };

// state transition (matrix)
UP.next = new Set([LEFT, RIGHT]);
DOWN.next = new Set([LEFT, RIGHT]);
LEFT.next = new Set([UP, DOWN]);
RIGHT.next = new Set([UP, DOWN]);

let SnakeBoard = function (canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");

    this.clear = function () { this.ctx.clearRect(0, 0, canvas.width, canvas.height); }
    this.setGridDiv = function (div) {
        this.w = this.canvas.width / div.x;
        this.h = this.canvas.height / div.y;
    };

    //
    this.drawPixel = function (x, y, color) {
        let ctx = this.ctx;
        ctx.save();
        ctx.fillStyle = color;
        ctx.fillRect(x * this.w, y * this.h, this.w, this.h);
        ctx.restore();
    };
    this.clearPixel = function (x, y) {
        this.ctx.clearRect(x * this.w, y * this.h, this.w, this.h);
    };
    this.drawHead = function (x, y) { this.drawPixel(x, y, "red"); };
    this.drawBody = function (x, y) { this.drawPixel(x, y, "blue"); };
    this.drawFood = function (x, y) { this.drawPixel(x, y, "green"); };

    //
    this.addEventListener = function (type, listener, options) {
        this.canvas.addEventListener(type, listener, options);
    };
    this.focus = function () {
        this.canvas.focus();
    }
}


let SnakeGame = function (board, div, speed) {
    'use strict';
    let temp;
    let me = this;

    this.board = board;
    this.board.clear();
    this.board.setGridDiv(div);

    this.gameLoop = null;
    this.fps = 1000 / speed; // speed = grid per 1000ms

    this.div = div;
    this.arr = []; // store the body, as a (reversed) queue
    this.dir = UP; // direction of move
    this.occupied = [];
    for (let i = 0; i < div.x; i++) {
        temp = new Array(div.y);
        temp.fill(false);
        this.occupied.push(temp);
    }

    this.display = function (s) {
        document.getElementById("state").innerHTML = s;
    }
    this.display("Playing...");

    this.isOccupied = function (point) {
        return this.occupied[point.x][point.y];
    };
    this.arr = [{ x: Math.floor(div.x / 2), y: Math.floor(div.y / 2) }];

    // Starting point
    temp = { x: Math.floor(div.x / 2), y: Math.floor(div.y / 2) };
    this.arr.push(temp);
    this.occupied[temp.x][temp.y] = true;
    // console.log(div, copy(this.arr), this.dir);
    this.board.drawHead(this.arr[0].x, this.arr[0].y);

    // Food
    this.generateFood = function () {
        let food = {};
        do {
            food.x = Math.floor(div.x * Math.random());
            food.y = Math.floor(div.y * Math.random());
        } while (this.isOccupied(food));
        this.food = food;
        this.board.drawFood(food.x, food.y);
    };
    this.generateFood();

    // move
    this.isInside = function (point) {
        let div = this.div;
        let x = point.x;
        let y = point.y;
        return (0 <= x) && (x < div.x) && (0 <= y) && (y < div.y);
    };

    this.move = function () {
        // console.log(this.arr);
        let head, tail;
        let dir = this.dir;
        let food = this.food;
        head = this.arr[0];
        let next = { x: head.x + dir.x, y: head.y + dir.y };
        if (!this.isInside(next)) {
            return false;
        }
        if (food.x === next.x && food.y === next.y) { // eat!
            this.board.clearPixel(food.x, food.y);

            this.arr.unshift(next);
            this.occupied[next.x][next.y] = true;
            this.board.drawHead(next.x, next.y);
            this.board.drawBody(head.x, head.y);
            if (this.arr.length === div.x * div.y) {
                return true;
            }
            this.generateFood();
        } else {
            tail = this.arr.pop();
            this.occupied[tail.x][tail.y] = false;
            this.board.clearPixel(tail.x, tail.y);
            if (this.isOccupied(next)) {
                return false;
            }
            this.arr.unshift(next);
            this.occupied[next.x][next.y] = true;
            this.board.drawHead(next.x, next.y);
            if (this.arr.length > 1) {
                this.board.drawBody(head.x, head.y);
            }
        }
        return null;
    };

    this.turns = [];
    this.turn = function (dir) {
        this.turns.push(dir);
    };
    this.start = function () {
        this.gameLoop = setInterval(function () {
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
            while (me.turns.length > 0) {
                let turn = me.turns.shift();
                if (me.dir.next.has(turn)) {
                    me.dir = turn;
                    console.log("turn to " + turn.name);
                    break;
                } else {
                    console.log("skip turn to " + turn.name);
                }
            }

            //
            // move
            //
            let result = me.move();
            if (result !== null) {
                if (result === true) {
                    me.display("Congratulations! You win!!!!");
                } else { //if (result === false) {
                    me.display("You lose!");
                }
                me.stop();
            }
        }, me.fps);
    };

    this.stop = function () {
        clearInterval(this.gameLoop);
    };
};

let board;
let game;
function init() {
    let speedDisplay = document.getElementById("speedDisplay");
    let speed = document.getElementById("speed");
    speedDisplay.innerHTML = speed.value;
    speed.addEventListener('input', function (ev) {
        // console.log(ev);
        speedDisplay.innerHTML = speed.value;
    });
    speed.addEventListener('change', function (ev) { // to support some browsers like IE 10
        // console.log(ev);
        speedDisplay.innerHTML = speed.value;
    });

    board = new SnakeBoard(document.getElementById("board"));
    board.addEventListener('keydown', function (ev) {
        // console.log(ev);
        ev.preventDefault();
        let dirMap = {
            "ArrowUp": UP,
            "ArrowDown": DOWN,
            "ArrowLeft": LEFT,
            "ArrowRight": RIGHT,
        };
        if (ev.key in dirMap) {
            game.turn(dirMap[ev.key]);
            return;
        }

        let div = document.getElementById("boardDiv").value;
        let speed = document.getElementById("speed").value;
        if (ev.key === "r") {
            if (game !== undefined) {
                game.stop();
            }
            game = new SnakeGame(board, { x: div, y: div }, speed);
            game.start();
        }
    });
    board.focus();
}