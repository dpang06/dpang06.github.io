/*
Game Rules:
Opening Moves:
The tentative first player places three stones on the board, two black and one white. The tentative second player then has three options:

    They can choose to play as black
    They can choose to play as white and place a second white stone
    Or they can place two more stones, one black and one white, and pass the choice of which color to play back to the tentative first player.

Because the tentative first player doesn't know where the tentative second player will place the additional stones if they take option 2 or 3, the swap2 opening protocol limits excessive studying of a line by only one of the players.


restartGame(); // done

Opening game:
state=0
openCount=0
openingMove(i, j)
openingTakeSide()

Playing game:
state=1
gameMove(i, j);
 */


{
    const PLAYER_A = 1;
    const PLAYER_B = -1;
    function flipPlayer(player) {
        return player * -1;
    }

    const STONE_A = 1;
    const STONE_B = -1;
    function flipStone(stone) {
        return stone * -1;
    }

    let n, k;
    let board;

    let state;
    const STATE_OPENING = 0;
    const STATE_PLAYING = 1;
    const STATE_END = 2;

    // opening
    let isFirstOpen, openCount;
    let currentPlayer;
    let currentStone;

    let winner;

    function initGame(N, K) {
        n = N;
        k = K;
    }

    function restartGame() {
        board = [];
        for (let i = 0; i < n; i++) {
            let row = [];
            for (let j = 0; j < n; j++) {
                row.push(0);
            }
            board.push(row);
        }
        // console.log(board);

        state = STATE_OPENING;
        isFirstOpen = true;
        openCount = 0;
        currentPlayer = PLAYER_A;
        currentStone = STONE_A;

        // winner = null;
    }

    function isInRange(i, j) {
        return (i >= 0 && i < n && j >= 0 && j < n);
    }

    // Not done:
    function getCurrentStone() {
        return currentStone;
    }

    function gameMove(x, y) {
        switch (state) {
            case 0:
                if (board[x][y] !== 0) return null;
                board[x][y] = currentStone;

                if (isWinningMove(x, y)) {
                    winner = currentStone;
                    state = 1;
                } else {
                    currentStone = flipStone(currentStone);
                }
                // console.log(board);

                return {
                    winner: winner,
                    state: state,
                };
            case 1:
            default:
                return null;
        }
    }

    function isWinningMove(x, y) {
        // check row
        if (checkConnect(x, y, [1, 0])) return true;

        // check column
        if (checkConnect(x, y, [0, 1])) return true;

        // check diagonal \
        if (checkConnect(x, y, [1, 1])) return true;

        // check diagonal /
        if (checkConnect(x, y, [1, -1])) return true;

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