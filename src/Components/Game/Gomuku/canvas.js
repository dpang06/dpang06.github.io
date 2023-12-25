{
    'use strict';
    let canvas, ctx;
    let width, height;
    let w, h, n; // grid
    let stoneRadius;
    let GRID_STYLE = {
        lineWidth: 1,
        strokeStyle: "black",
    }

    function initGraphic(N) {
        canvas = document.getElementById('board');
        ctx = canvas.getContext("2d");
        width = canvas.width;
        height = canvas.height;
        n = N;
        w = width / (n + 1);
        h = height / (n + 1);

        stoneRadius = Math.min(w, h) / 2.5;

        canvas.addEventListener('contextmenu', e => e.preventDefault());
        drawGrid();
    }

    function drawGrid() {
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

    function drawStone(i, j, color) {
        ctx.save();

        // style
        x = w + i * w;
        y = h + j * h;

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

    function subscribeBoardClick(listener) {
        canvas.addEventListener('mouseup', function (e) {
            e.preventDefault();

            let x = e.offsetX;
            let y = e.offsetY;
            let i, j;
            let tmp

            tmp = trisect(x, w, stoneRadius);
            if (tmp === null) return;
            i = tmp - 1
            if (i < 0 || i >= n) return;

            tmp = trisect(y, h, stoneRadius);
            if (tmp === null) return;
            j = tmp - 1
            if (j < 0 || j >= n) return;

            listener(e, i, j);
        });
    }

    function trisect(value, div, range) {
        let remain = value % div;
        if (remain < range) {
            return (value - remain) / w;
        } else if (remain > div - range) {
            return (value - remain) / w + 1;
        } else {
            return null;
        }
    }

    function resetBoard() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawGrid();
    }
}