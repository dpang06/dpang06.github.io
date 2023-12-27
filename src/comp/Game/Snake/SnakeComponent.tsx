import { useEffect, useMemo, useRef, useState } from 'react';
import SnakeBoard from './SnakeBoard';
import SnakeGame from './SnakeGame';
import './SnakeComponent.css';

const SnakeComponent = (props: object) => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const [game, setGame] = useState<SnakeGame | null>(null);
    const [board, setBoard] = useState<SnakeBoard | null>(null);
    const [gameDiv, setGameDiv] = useState<number>(20);
    const [gameSpeed, setGameSpeed] = useState<number>(20);
    const [state, setState] = useState<string>("");

    // memoized, because we use this value only when "reset", not when the value changes
    const gameDivActual = useMemo<number>(() => gameDiv, [gameDiv]);
    const gameSpeedActual = useMemo<number>(() => gameSpeed, [gameSpeed]);

    useEffect(() => {
        if (board === null) {
            const canvas = canvasRef.current;
            if (canvas == null) return; // component is unmounted
            setBoard(new SnakeBoard(canvas));
        }
    }, [board]);

    useEffect(() => {
        if (board === null) return;
        if (game === null) {
            board.resetKeydown();
            let g = new SnakeGame(board,
                { x: gameDivActual, y: gameDivActual }, gameSpeedActual,
                (s) => { setState(s); },
                () => { setGame(null); }
            );
            g.start();
            setGame(g);
            board.focus();
        }
    }, [board, game, gameDivActual, gameSpeedActual]);

    return (
        <div>
            <div>
                <canvas ref={canvasRef} id="snakeBoardCanvas" width="600" height="600" tabIndex={1}>Your browser does not support HTML5 canvas</canvas>
            </div>
            <div>
                <span id="snakeGameState">{state}</span><br />

                <label htmlFor="snakeBoardGameDiv">Board Division:</label>
                <input type="number" id="snakeBoardGameDiv" max="200" value={gameDiv} onChange={(ev) => setGameDiv(parseInt(ev.target.value))} /><br />

                <label htmlFor="snakeBoardGameSpeed">Speed:</label>
                <input type="range" id="snakeBoardGameSpeed" min="1" max="30" value={gameSpeed} onChange={(ev) => setGameSpeed(parseInt(ev.target.value))} />
                <span id="snakeBoardGameSpeedDisplay">{gameSpeed}</span>
                <span>Grid Per Second</span><br />

                <span id="snakeBoardInfo">Press R to start/restart</span>
            </div>
        </div>
    );
}

export default SnakeComponent;
