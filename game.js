"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.play = void 0;
var createBoard = function (options) {
    options = options !== null && options !== void 0 ? options : {};
    var _a = options.width, width = _a === void 0 ? 20 : _a, _b = options.height, height = _b === void 0 ? width : _b, _c = options.liveness, liveness = _c === void 0 ? 0.5 : _c;
    var board = Array.from({ length: height }, function () {
        return Array.from({ length: width }, function () {
            return (Math.random() < liveness) ? 1 : 0;
        });
    });
    return board;
};
var countNeighbors = function (board, row, column) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r;
    var north = (_b = (_a = board[row - 1]) === null || _a === void 0 ? void 0 : _a[column]) !== null && _b !== void 0 ? _b : 0;
    var northeast = (_d = (_c = board[row - 1]) === null || _c === void 0 ? void 0 : _c[column + 1]) !== null && _d !== void 0 ? _d : 0;
    var east = (_f = (_e = board[row]) === null || _e === void 0 ? void 0 : _e[column + 1]) !== null && _f !== void 0 ? _f : 0;
    var southeast = (_h = (_g = board[row + 1]) === null || _g === void 0 ? void 0 : _g[column + 1]) !== null && _h !== void 0 ? _h : 0;
    var south = (_k = (_j = board[row + 1]) === null || _j === void 0 ? void 0 : _j[column]) !== null && _k !== void 0 ? _k : 0;
    var southwest = (_m = (_l = board[row + 1]) === null || _l === void 0 ? void 0 : _l[column - 1]) !== null && _m !== void 0 ? _m : 0;
    var west = (_p = (_o = board[row]) === null || _o === void 0 ? void 0 : _o[column - 1]) !== null && _p !== void 0 ? _p : 0;
    var northwest = (_r = (_q = board[row - 1]) === null || _q === void 0 ? void 0 : _q[column - 1]) !== null && _r !== void 0 ? _r : 0;
    return north + northeast + east + southeast + south + southwest + west +
        northwest;
};
var tick = function (board) {
    return board.map(function (row, rowNum) {
        return row.map(function (cell, columnNum) {
            var neighbors = countNeighbors(board, rowNum, columnNum);
            if (neighbors === 3 || (cell && neighbors === 2)) {
                return 1;
            }
            return 0;
        });
    });
};
var play = function (board) {
    var b = Array.isArray(board) ? board : createBoard(board);
    var canvas = document.querySelector("canvas");
    if (!canvas) {
        canvas = document.createElement("canvas");
        document.body.appendChild(canvas);
    }
    var cellSize = 40;
    canvas.height = b.length * cellSize;
    canvas.width = b[0].length * cellSize;
    var ctx = canvas.getContext("2d");
    var render = function (grid) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        grid.forEach(function (row, rowIndex) {
            row.forEach(function (cell, colIndex) {
                ctx.beginPath();
                ctx.rect(colIndex * cellSize, rowIndex * cellSize, cellSize, cellSize);
                ctx.fillStyle = cell ? "#000000" : "#ffffff";
                ctx.fill();
            });
        });
    };
    var lastTime = performance.now();
    // TODO: Make this an option
    var fps = 1;
    var loop = function (time) {
        // Slow down the animation to the desired speed.
        if (fps && (time - lastTime) < (1000 / fps)) {
            requestAnimationFrame(loop);
            return;
        }
        lastTime = time;
        b = tick(b);
        render(b);
        requestAnimationFrame(loop);
    };
    render(b);
    requestAnimationFrame(loop);
};
exports.play = play;
(0, exports.play)();
