import { useCallback, useEffect, useRef, useState } from 'react'
import GomukuBoard from './GomukuBoard';
import GomukuGame, { GameState, Input, InputType, MoveHandlerOutput, Phase } from './GomukuGame';
import { Player, Stone, flipStone } from './util';
import './GomukuComponent.css';
import { Button } from 'react-bootstrap';

const gameStateMessage = (state: GameState) => {
  let player = state.currentPlayer === Player.A ? "A" : "B";
  let stone = state.currentStone === Stone.BLACK ? "Black" : "White";
  let message;
  if (state.phase === Phase.OPEN && !state.isFirstOpenMove) {
    let otherStone = flipStone(state.currentStone) === Stone.BLACK ? "Black" : "White";
    message = `Player ${player} to go; Take ${otherStone} or Play ${stone}`;
  } else if (state.phase === Phase.OPEN || state.phase === Phase.PLAY) {
    message = `Player ${player} to go; Play ${stone}`;
  } else if (state.phase === Phase.END) {
    let winner = state.winner === Player.A ? "A" : "B";
    message = `Player ${winner} wins!`;
  } else {
    message = "???";
  }
  return message;
};

const N = 15;
const K = 5;
const GomukuComponent = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [board, setBoard] = useState<GomukuBoard | null>(null);
  const [game, setGame] = useState<GomukuGame | null>(null);
  const [gameFlow, setGameFlow] = useState<Generator<MoveHandlerOutput | undefined, void, Input> | null>(null);
  const [message, setMessage] = useState("");

  const onUserPlay = useCallback((
    board: GomukuBoard, game: GomukuGame, gameFlow: Generator<MoveHandlerOutput | undefined, void, Input>,
    i: number, j: number
  ) => {
    setMessage("");
    let output = gameFlow.next({ type: InputType.MOVE, i: i, j: j }).value;
    console.log(output);
    if (!output) {
      setMessage("The game has finished");
      return;
    }
    console.log(output.success);
    if (!output.success) {
      setMessage(`Invalid move. ` + gameStateMessage(game.state));
      return; // invalid move
    }

    console.log("onUserPlay, drawStone")
    board.drawStone({ x: i, y: j }, output.stone! === Stone.BLACK ? "black" : "white");
    gameFlow.next(); // continue game flow
    setMessage(gameStateMessage(game.state));
  }, []);

  const onUserTake = useCallback((
    board: GomukuBoard | null, game: GomukuGame | null, gameFlow: Generator<MoveHandlerOutput | undefined, void, Input> | null,
  ) => {
    if (!board || !game || !gameFlow) return;
    setMessage("");
    let output = gameFlow.next({ type: InputType.TAKE, i: undefined, j: undefined }).value;
    if (!output) {
      setMessage("The game has finished");
      return;
    }
    if (!output.success) {
      setMessage(`Invalid move. ` + gameStateMessage(game.state));
      return; // invalid move
    }

    // no need to check game state

    gameFlow.next(); // continue game flow
    setMessage(gameStateMessage(game.state));
  }, []);

  const onUserRestart = (board: GomukuBoard | null) => {
    setMessage("");

    if (board) board.resetBoard();
    setGame(null);
    setGameFlow(null);
  }

  useEffect(() => {
    if (board === null) {
      const canvas = canvasRef.current;
      if (canvas == null) return; // component is unmounted
      setBoard(new GomukuBoard(canvas, { n: N }));
    }
  }, [board]);

  useEffect(() => {
    if (game === null) {
      setGame(new GomukuGame(N, K));
    }
  }, [game]);

  useEffect(() => {
    if (!board || !game) return;
    if (gameFlow === null) {
      let gameFlow = game.start();
      gameFlow.next(); // skip first input
      setGameFlow(gameFlow);
      board.onBoardClick((ev, i, j) => {
        switch (ev.button) {
          case 0: // left click
            onUserPlay(board, game, gameFlow, i, j);
            break;
          case 2: // right click
            break;
          default:
            break;
        }
      });
      setMessage(gameStateMessage(game.state));
    }
  }, [board, game, gameFlow, onUserPlay]);

  return (
    <div id="GomukuComponent">
      <header></header>
      <main>
        <canvas ref={canvasRef} width="800" height="800">
          Your browser does not support HTML 5
        </canvas>
      </main>
      <aside className="panel">
        <div>
          <Button onClick={(ev) => onUserTake(board, game, gameFlow)}>Take!</Button>
          <Button onClick={(ev) => onUserRestart(board)}>Restart</Button>
        </div>
        <p>{message}</p>
      </aside>
      <footer>
        <a href="https://en.wikipedia.org/wiki/Gomoku#Swap2" target="_blank" rel="noopener noreferrer">Rules Here (Swap2)</a>
      </footer>
    </div>
  );
}

export default GomukuComponent;