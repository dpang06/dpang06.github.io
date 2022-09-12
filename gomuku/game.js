/*
Game Rules:
Opening Moves:
The tentative first player places three stones on the board, two black and one white. The tentative second player then has three options:

    They can choose to play as black
    They can choose to play as white and place a second white stone
    Or they can place two more stones, one black and one white, and pass the choice of which color to play back to the tentative first player.

Because the tentative first player doesn't know where the tentative second player will place the additional stones if they take option 2 or 3, the swap2 opening protocol limits excessive studying of a line by only one of the players.
*/

const PLAYER_A = 1;
const PLAYER_B = -1;
function flipPlayer(player) { return player * -1; }

const STONE_BLACK = 1;
const STONE_WHITE = -1;
function flipStone(stone) { return stone * -1; }

const INPUT_MOVE = "move";
const INPUT_TAKE = "take";

const PHASE_OPEN = "open";
const PHASE_PLAY = "play";
const PHASE_END = "end";

{
    'use strict';
    let n, k;
    function createEmptyBoard() {
        board = [];
        for (let i = 0; i < n; i++) {
            let row = [];
            for (let j = 0; j < n; j++) {
                row.push(0);
            }
            board.push(row);
        }
        return board;
    }

    let state;
    function getGameState() { return state; }
    function flipCurrentPlayer() { state.currentPlayer = flipPlayer(state.currentPlayer); }
    function getCurrentPlayer() { return state.currentPlayer; }
    function flipCurrentStone() { state.currentStone = flipStone(state.currentStone); }
    function getCurrentStone() { return state.currentStone; }


    function isInRange(i, j) { return (i >= 0 && i < n && j >= 0 && j < n); }
    function isValidMove(i, j) { return Number.isInteger(i) && Number.isInteger(j) && isInRange(i, j) && state.board[i][j] === 0; }

    function gameSwap2(N, K) { return gameSwap2Generator(N, K) };
    function* gameSwap2Generator(N, K) {
        n = N;
        k = K;

        //
        // open phase
        //
        state = {
            phase: PHASE_OPEN,
            board: createEmptyBoard(),
            isFirstOpenMove: true,
            currentPlayer: PLAYER_A,
            currentStone: STONE_BLACK,
        }
        console.log(state);

        yield* promptInput(applyMove);
        yield* promptInput(applyMove);
        yield* promptInput(applyMove);
        flipCurrentPlayer();
        state.isFirstOpenMove = false;
        while (true) {
            // player = B, currentStone = white
            // console.log(`Does Player ${getCurrentPlayer()} want to play the black?`)
            yield* promptInput(applyMoveOrTake);
            if (state.lastInput.type === INPUT_TAKE) {
                flipCurrentPlayer(); // another player goes
                break; // end opening phase
            }
            if (isWinningMove(state.lastInput.i, state.lastInput.j)) {
                state.phase = PHASE_END;
                state.winner = state.currentPlayer; // assume the current player immediately accepts the winning situation!
                yield* promptInput(applyNone);
            }

            // B, black
            // console.log(`Does Player ${getCurrentPlayer()} want to play the white?`)
            yield* promptInput(applyMoveOrTake); // B accept white?
            if (state.lastInput.type === INPUT_TAKE) {
                flipCurrentPlayer(); // another player goes
                break; // end opening phase
            }

            flipCurrentPlayer();

            if (isWinningMove(state.lastInput.i, state.lastInput.j)) {
                state.phase = PHASE_END;
                state.winner = state.currentPlayer; // assume the current player immediately accepts the winning situation!
                yield* promptInput(applyNone);
            }

            // player = A, nextStone = white
        }
        console.log(`Opening done; The current player ${state.currentPlayer} is playing ${state.currentStone}`);

        //
        // play phase
        //
        state.phase = PHASE_PLAY;
        while (true) {
            yield* promptInput(applyMove);
            if (isWinningMove(state.lastInput.i, state.lastInput.j)) {
                state.winner = state.currentPlayer;
                break;
            }
            flipCurrentPlayer();
        }

        //
        // end phase
        //
        state.phase = PHASE_END;
        yield* promptInput(applyNone);
    }

    /**
     * Call this function with
     * yield* promptInput(handler)
     * @param {*} handler handler that apply the moves and return output with output.success = true or false
     */
    function* promptInput(handler) {
        let loop = true;
        let output = { success: false };
        for (let input = yield; loop; input = yield output) {
            output = handler(input);
            if (output.success)
                loop = false; // yield the last output and leave
        }
    }

    function applyMove(input) {
        state.lastInput = input;
        let output = { success: false };
        if (input.type !== INPUT_MOVE) return output;

        console.log(`move(${input.i}, ${input.j})`);
        let i = input.i;
        let j = input.j;
        if (!isValidMove(i, j)) return output;

        // console.log(`board[${i}][${j}] = ${state.currentStone}`);
        state.board[i][j] = state.currentStone;
        output.success = true;
        output.stone = state.currentStone;
        flipCurrentStone();

        return output;
    }

    function applyTake(input) {
        state.lastInput = input;
        let output = { success: false };
        if (input.type !== INPUT_TAKE) return output;

        console.log("take()");
        output.success = true;
        return output;
    }

    function applyMoveOrTake(input) {
        switch (input.type) {
            case INPUT_MOVE: return applyMove(input);
            case INPUT_TAKE: return applyTake(input);
            default: return { success: false };
        }
    }
    
    function applyNone(input) {
        return false;
    }

    function isWinningMove(x, y) {
        if (checkConnect(x, y, [1, 0])) return true; // check row
        if (checkConnect(x, y, [0, 1])) return true; // check column
        if (checkConnect(x, y, [1, 1])) return true; // check diagonal \
        if (checkConnect(x, y, [1, -1])) return true; // check diagonal /
        return false;
    }

    function checkConnect(x, y, v) {
        let stone = board[x][y];
        let dx = v[0];
        let dy = v[1];

        count = 1;
        for (let s = +1; s < +k; s++) {
            let x1 = x + s * dx;
            let y1 = y + s * dy;
            if (isInRange(x1, y1) && board[x1][y1] === stone) {
                count++;
            } else {
                break;
            }
        }
        for (let s = -1; s > -k; s--) {
            let x1 = x + s * dx;
            let y1 = y + s * dy;
            if (isInRange(x1, y1) && board[x1][y1] === stone) {
                count++;
            } else {
                break;
            }
        }
        return (count >= k);
    }
}