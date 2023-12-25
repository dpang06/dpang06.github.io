{
    let gameFlow;

    const N = 15;
    const K = 5;
    function init() {
        initGraphic(N);
        subscribeBoardClick(function (e, i, j) {
            switch (e.button) {
                case 0: // left click
                    onUserPlay(i, j);
                case 2: // right click
                default:
                    break;
            }
        });

        document.getElementById("take").addEventListener('click', function (ev) {
            onUserTake();
        });
        document.getElementById("restart").addEventListener('click', function (ev) {
            onUserRestart();
        });

        restart();
    }

    function onUserPlay(i, j) {
        displayMessage("");
        let output = gameFlow.next({ type: INPUT_MOVE, i: i, j: j }).value;
        // console.log(`output:`); console.log(output);
        if (!output.success) {
            displayMessage(`Invalid move`);
            return; // invalid move
        }

        drawStone(i, j, output.stone == STONE_BLACK ? "black" : "white");
        gameFlow.next().value; // continue game flow
        displayGameState();
    }

    function onUserTake() {
        displayMessage("");
        let output = gameFlow.next({ type: INPUT_TAKE }).value;
        // console.log(`output:`); console.log(output);
        if (!output.success) {
            displayMessage(`Invalid move`);
            return; // invalid move
        }
        displayMessage("Game start!");

        // no need to check game state

        gameFlow.next().value; // continue game flow
        displayGameState();
    }

    function onUserRestart() {
        displayMessage("");
        restart();
    }

    function restart() {
        resetBoard();
        gameFlow = gameSwap2(N, K);
        gameFlow.next().value;
        displayGameState();
    }

    function displayMessage(message) {
        document.getElementById("message").innerHTML = message;
    }

    function displayGameState() {
        let state = getGameState();
        let player = state.currentPlayer === PLAYER_A ? "A" : "B";
        let stone = state.currentStone === STONE_BLACK ? "Black" : "White";
        let message;
        if (state.phase === PHASE_OPEN && !state.isFirstOpenMove) {
            let otherStone = flipStone(state.currentStone) === STONE_BLACK ? "Black" : "White";
            message = `Player ${player} to go; Take ${otherStone} or Play ${stone}`;
        } else if (state.phase === PHASE_OPEN || state.phase === PHASE_PLAY) {
            message = `Player ${player} to go; Play ${stone}`;
        } else if (state.phase === PHASE_END) {
            let winner = state.winner === PLAYER_A ? "A" : "B";
            message = `Player ${winner} wins!`;
        } else {
            message = "???";
        }
        document.getElementById("currentState").innerHTML = message;
    }
}