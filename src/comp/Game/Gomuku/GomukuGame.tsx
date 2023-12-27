import GomukuBoard from "./GomukuBoard";
import { Player, Stone, flipPlayer, flipStone } from "./util";

/*
Game Rules:
Opening Moves:
The tentative first player places three stones on the board, two black and one white. The tentative second player then has three options:

    They can choose to play as black
    They can choose to play as white and place a second white stone
    Or they can place two more stones, one black and one white, and pass the choice of which color to play back to the tentative first player.

Because the tentative first player doesn't know where the tentative second player will place the additional stones if they take option 2 or 3, the swap2 opening protocol limits excessive studying of a line by only one of the players.
*/


export enum Phase {
    OPEN = "open",
    PLAY = "play",
    END = "end",
}

export interface Input {
    type: InputType,
    i: number | undefined,
    j: number | undefined,
}

export enum InputType {
    MOVE = "move",
    TAKE = "take",
}

export interface GameState {
    phase: Phase;
    board: number[][];
    isFirstOpenMove: boolean;
    currentPlayer: Player;
    currentStone: Stone;
    lastInput: Input | null;
    winner?: Player;
}

function createEmptyBoard(n: number) {
    let board = [];
    for (let i = 0; i < n; i++) {
        let row = [];
        for (let j = 0; j < n; j++) {
            row.push(0);
        }
        board.push(row);
    }
    return board;
}

export interface MoveHandlerOutput {
    success: boolean,
    stone?: Stone,
}

export default class GomukuGame {
    n: number;
    k: number;
    state: GameState;
    getGameState() { return this.state; }
    flipCurrentPlayer() { this.state.currentPlayer = flipPlayer(this.state.currentPlayer); }
    getCurrentPlayer() { return this.state.currentPlayer; }
    flipCurrentStone() { this.state.currentStone = flipStone(this.state.currentStone); }
    getCurrentStone() { return this.state.currentStone; }

    isInRange(i: number, j: number) { return (i >= 0 && i < this.n && j >= 0 && j < this.n); }
    isValidMove(i: number, j: number) { return Number.isInteger(i) && Number.isInteger(j) && this.isInRange(i, j) && this.state.board[i][j] === 0; }

    constructor(n: number, k: number) {
        this.n = n;
        this.k = k;

        this.state = {
            phase: Phase.OPEN,
            board: createEmptyBoard(this.n),
            isFirstOpenMove: true,
            currentPlayer: Player.A,
            currentStone: Stone.BLACK,
            lastInput: null,
        }
        console.log(this.state);

    }

    *start() {
        //
        // open phase
        //
        console.log("Open phase");
        this.state = {
            phase: Phase.OPEN,
            board: createEmptyBoard(this.n),
            isFirstOpenMove: true,
            currentPlayer: Player.A,
            currentStone: Stone.BLACK,
            lastInput: null,
        }

        // Need ts.config for generator delegation
        // "complierOptions": {"target": "es2015"}
        // Player = A, currentStone = black
        // A places 3 stones
        yield* this.promptInput(this.applyMove); // place black
        yield* this.promptInput(this.applyMove); // place white
        yield* this.promptInput(this.applyMove); // place black
        this.flipCurrentPlayer(); // B goes
        this.state.isFirstOpenMove = false;

        for (let i = 0; i < 1; i++) {
            let lastInput: Input;

            // player = B, currentStone = white
            // console.log(`Does Player B want to play the black?`)
            yield* this.promptInput(this.applyMoveOrTake);
            lastInput = this.state.lastInput!;
            if (lastInput!.type === InputType.TAKE) {
                this.flipCurrentPlayer(); // B took black, A goes
                break; // end opening phase
            }
            // B placed a white

            // player = B, currentStone = black
            // console.log(`Does Player B want to play the white?`)
            yield* this.promptInput(this.applyMoveOrTake);
            lastInput = this.state.lastInput!;
            if (lastInput!.type === InputType.TAKE) {
                this.flipCurrentPlayer(); // B took white, A goes
                break; // end opening phase
            }
            // B placed a black

            this.flipCurrentPlayer();

            // player = A, nextStone = white
            // A has to take black or choose white
            // console.log(`Does Player ${getCurrentPlayer()} want to play the white?`)
            yield* this.promptInput(this.applyMoveOrTake); // A accept white?
            lastInput = this.state.lastInput!;
            if (lastInput!.type === InputType.TAKE) {
                this.flipCurrentPlayer(); // A took white, B goes
                break; // end opening phase
            } else {
                this.flipCurrentPlayer(); // A took black and placed a stone, B goes
                break; // end opening phase
            }
        }

        console.log(`Opening done; The current player ${this.state.currentPlayer} is playing ${this.state.currentStone}`);

        //
        // play phase
        //
        console.log("Play phase");
        this.state.phase = Phase.PLAY;
        while (!(this.state.winner)) {
            yield* this.promptInput(this.applyMove);
            if (this.isWinningMove(this.state.lastInput!.i!, this.state.lastInput!.j!)) {
                this.state.winner = this.state.currentPlayer;
            } else {
                this.flipCurrentPlayer();
            }
        }

        //
        // end phase
        //
        console.log("End phase");
        this.state.phase = Phase.END;
        // yield* this.promptInput(this.applyNone);
    }

    *promptInput(handler: (input: Input) => MoveHandlerOutput) {
        handler = handler.bind(this);
        let loop = true;
        let output: MoveHandlerOutput = { success: false };
        for (let input: Input = yield; loop; input = yield output) {
            output = handler(input);
            if (output.success) {
                loop = false; // yield the last output and leave
            }
        }
    }

    applyMove(input: Input) {
        this.state.lastInput = input;
        let output: MoveHandlerOutput;
        output = { success: false };
        if (input.type !== InputType.MOVE) return output;

        console.log(`move(${input.i}, ${input.j})`);
        const i = input.i!;
        const j = input.j!;
        if (!this.isValidMove(i, j)) return output;

        // console.log(`board[${i}][${j}] = ${state.currentStone}`);
        this.state.board[i][j] = this.state.currentStone;
        output.success = true;
        output.stone = this.state.currentStone;
        this.flipCurrentStone();

        return output;
    }

    applyTake(input: Input) {
        this.state.lastInput = input;
        let output = { success: false };
        if (input.type !== InputType.TAKE) return output;

        console.log("take()");
        output.success = true;

        return output;
    }

    applyMoveOrTake(input: Input) {
        switch (input.type) {
            case InputType.MOVE: return this.applyMove(input);
            case InputType.TAKE: return this.applyTake(input);
            default: return { success: false };
        }
    }

    applyNone(input: Input) {
        // return false;
        return { success: true };
    }

    checkConnect(x: number, y: number, dv: { x: number, y: number }) {
        const board = this.state.board;
        const k = this.k;

        const stone = board[x][y];
        const { x: dx, y: dy } = dv;

        let count = 1;
        for (let s = +1; s < +k; s++) {
            const x1 = x + s * dx;
            const y1 = y + s * dy;
            if (this.isInRange(x1, y1) && board[x1][y1] === stone) {
                count++;
            } else {
                break;
            }
        }
        for (let s = -1; s > -k; s--) {
            const x1 = x + s * dx;
            const y1 = y + s * dy;
            if (this.isInRange(x1, y1) && board[x1][y1] === stone) {
                count++;
            } else {
                break;
            }
        }
        return (count >= k);
    }

    isWinningMove(x: number, y: number) {
        if (this.checkConnect(x, y, { x: 1, y: 0 })) return true; // check row
        if (this.checkConnect(x, y, { x: 0, y: 1 })) return true; // check column
        if (this.checkConnect(x, y, { x: 1, y: 1 })) return true; // check diagonal \
        if (this.checkConnect(x, y, { x: 1, y: -1 })) return true; // check diagonal /
        return false;
    }
}