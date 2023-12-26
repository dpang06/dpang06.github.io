import { Direction, Point, RIGHT, UP, LEFT, DOWN } from "./util";

// wrapper of canvas
export default class SnakeBoard {
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
    w: number;
    h: number;
    keydownHandlers: Array<(e: KeyboardEvent) => void> = [];

    constructor(canvas: HTMLCanvasElement, div: { x: number, y: number } = { x: 20, y: 20 }) {
        this.canvas = canvas;
        let ctx = canvas.getContext('2d');
        if (ctx == null) throw new Error('canvas context is null');
        this.ctx = ctx;
        this.w = this.canvas.width / div.x;
        this.h = this.canvas.height / div.y;

        this.canvas.addEventListener('keydown', (e: KeyboardEvent) => {
            this.keydownHandlers.forEach((handler) => handler(e));
        });
    }

    // drawing (misc)
    clear() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
    setGridDiv(div: { x: number, y: number }) {
        this.w = this.canvas.width / div.x;
        this.h = this.canvas.height / div.y;
    };

    // drawing
    drawPixel(x: number, y: number, color: string) {
        let ctx = this.ctx;
        ctx.save();
        ctx.fillStyle = color;
        ctx.fillRect(x * this.w, y * this.h, this.w, this.h);
        ctx.restore();
    };
    drawHeadShape(x: number, y: number, color: string, dir: Direction) {
        let ctx = this.ctx;
        ctx.save();
        ctx.fillStyle = color;

        let points: Point[];
        if (dir === RIGHT) {
            points = [
                { x: 0, y: 0 },
                { x: 0, y: 1 },
                { x: 0.5, y: 1 },
                { x: 1, y: 0.5 },
                { x: 0.5, y: 0 },
            ];
        } else if (dir === UP) {
            points = [
                { x: 0, y: 1 },
                { x: 1, y: 1 },
                { x: 1, y: 0.5 },
                { x: 0.5, y: 0 },
                { x: 0, y: 0.5 },
            ];
        } else if (dir === LEFT) {
            points = [
                { x: 1, y: 1 },
                { x: 1, y: 0 },
                { x: 0.5, y: 0 },
                { x: 0, y: 0.5 },
                { x: 0.5, y: 1 },
            ];
        } else if (dir === DOWN) {
            points = [
                { x: 1, y: 0 },
                { x: 0, y: 0 },
                { x: 0, y: 0.5 },
                { x: 0.5, y: 1 },
                { x: 1, y: 0.5 },
            ];
        } else {
            throw new Error("Impossible direction");
        }
        ctx.beginPath();
        ctx.moveTo((x + points[0].x) * this.w, (y + points[0].y) * this.h);
        for (let i = 1; i < points.length; i++) {
            ctx.lineTo((x + points[i].x) * this.w, (y + points[i].y) * this.h);
        }
        ctx.closePath();
        ctx.fill();

        ctx.restore();
    }
    clearPixel(x: number, y: number) {
        this.ctx.clearRect(x * this.w, y * this.h, this.w, this.h);
    };
    drawHead(x: number, y: number, dir: Direction) { this.drawHeadShape(x, y, "red", dir); };
    drawBody(x: number, y: number) { this.drawPixel(x, y, "blue"); };
    drawFood(x: number, y: number) { this.drawPixel(x, y, "green"); };

    // events and interactions
    focus() { this.canvas.focus(); }
    onKeydown(listener: (ev: KeyboardEvent) => void) {
        this.keydownHandlers.push(listener);
    }
    resetKeydown() {
        this.keydownHandlers = [];
    }
}
