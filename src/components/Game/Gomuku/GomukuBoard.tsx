import { Point } from "./util";

interface Size {
    width: number;
    height: number;
}

const GRID_STYLE = {
    lineWidth: 1,
    strokeStyle: "black",
}

export default class GomukuBoard {
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
    n: number;
    gridSize: Size;
    stoneRadius: number;
    boardClickHandlers: Array<(ev: MouseEvent, i: number, j: number) => void>;

    constructor(
        canvas: HTMLCanvasElement,
        options: {
            n: number
        }
    ) {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d")!;

        this.n = options.n;

        this.gridSize = {
            width: this.canvas.width / (this.n + 1),
            height: this.canvas.height / (this.n + 1),
        };
        this.stoneRadius = Math.min(this.gridSize.width, this.gridSize.height) / 2.5;

        canvas.addEventListener('contextmenu', e => e.preventDefault()); // prevent right click
        this.drawGrid();

        //
        this.boardClickHandlers = [];
        canvas.addEventListener('mouseup', (e) => {
            e.preventDefault();
            const { width: w, height: h } = this.gridSize;
            const n = this.n;

            let x = e.offsetX;
            let y = e.offsetY;
            let i: number, j: number;
            let tmp

            tmp = this.trisect(x, w, this.stoneRadius);
            if (tmp === null) return;
            i = tmp - 1
            if (i < 0 || i >= n) return;

            tmp = this.trisect(y, h, this.stoneRadius);
            if (tmp === null) return;
            j = tmp - 1
            if (j < 0 || j >= n) return;

            this.boardClickHandlers.forEach(handler => handler(e, i, j));
        });
    }

    drawGrid() {
        const ctx = this.ctx;
        const width = this.canvas.width;
        const height = this.canvas.height;
        const { width: w, width: h } = this.gridSize;
        const n = this.n;

        ctx.save();

        // style
        ctx.lineWidth = GRID_STYLE.lineWidth;
        ctx.strokeStyle = GRID_STYLE.strokeStyle;

        // horizontal
        for (let i = 0; i < n; i++) {
            ctx.beginPath();
            ctx.moveTo(w, w + i * w);
            ctx.lineTo(width - w, w + i * w);
            ctx.stroke();
        }

        // vertical
        for (let i = 0; i < n; i++) {
            ctx.beginPath();
            ctx.moveTo(h + i * h, h);
            ctx.lineTo(h + i * h, height - h);
            ctx.stroke();
        }

        ctx.restore();
    }

    drawStone(p: Point, color: string) {
        console.log("draw stone");
        const ctx = this.ctx;
        const { width: w, width: h } = this.gridSize;
        const stoneRadius = this.stoneRadius;

        ctx.save();

        // style
        const x = w + p.x * w;
        const y = h + p.y * h;

        if (color !== null) {
            ctx.beginPath();
            ctx.arc(x, y, stoneRadius, 0, 2 * Math.PI);
            ctx.fillStyle = color;
            ctx.fill();
        } else {
            // clean the stone and redraw
            ctx.clearRect(x - stoneRadius, y - stoneRadius, 2 * stoneRadius, 2 * stoneRadius);

            ctx.lineWidth = GRID_STYLE.lineWidth;
            ctx.strokeStyle = GRID_STYLE.strokeStyle;

            // horizontal
            ctx.beginPath();
            ctx.moveTo(x - stoneRadius, y);
            ctx.lineTo(x + stoneRadius, y);
            ctx.stroke();

            // vertical
            ctx.beginPath();
            ctx.moveTo(x, y - stoneRadius);
            ctx.lineTo(x, y + stoneRadius);
            ctx.stroke();
        }

        ctx.restore();
    }

    trisect(value: number, div: number, range: number) {
        let remain = value % div;
        if (remain < range) {
            return (value - remain) / div;
        } else if (remain > div - range) {
            return (value - remain) / div + 1;
        } else {
            return null;
        }
    }

    onBoardClick(listener: (ev: MouseEvent, i: number, j: number) => void) {
        this.boardClickHandlers.push(listener);
    }

    resetBoard() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.drawGrid();
    }

    resetBoardClick() {
        this.boardClickHandlers = [];
    }
}