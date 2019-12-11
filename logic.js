let chess = document.getElementById("chess");  // 拿到canvas的信息

const size = 5;  // 棋盘大小
let side_len = parseInt(chess.getAttribute("width"));  // 棋盘边长
let unit_len = side_len / size;  // 一个格子的边长
let radius = unit_len / 5;  // 棋子的半径
let margin = 15;  // 棋盘边框宽度
let offset = margin * 2 / size;  // 画线时的偏移量

let resultTxt = document.getElementById("result-wrap");

let chessBoard = []; // 棋盘
// 清空棋盘
for (let i = 0; i < size; i++) {
    chessBoard[i] = [];
    for (let j = 0; j < size; j++) {
        chessBoard[i][j] = false;
    }
}

// 画棋盘
let context = chess.getContext('2d');
context.strokeStyle = '#bfbfbf';  // 边框颜色
window.onload = function() {
    drawChessBoard();  // 画棋盘
    oneStep(0,0);
    chessBoard[0][0] = true
};
document.getElementById("restart").onclick = function() {
    window.location.reload();
};
document.getElementById("goback").onclick = function() {

};

chess.onclick = function(e) {
    let x = e.offsetX;
    let y = e.offsetY;
    let i = Math.floor(x / unit_len);
    let j = Math.floor(y / unit_len);
    let chooseLocation = [i, j];

    if (chessBoard[i][j] === true) {
        deleteStep(i, j)
    }
    if (chessBoard[i][j] === false) {
        oneStep(i, j)
    }

    chessBoard[i][j] = !chessBoard[i][j];  // 更新鼠标点击的格子
    updateChessBoard(chooseLocation);  // 更新周围格子

    // 检查一下是否已经赢了
    let empty_num = 0;  // 棋盘上空格子的数量
    for (let i = 0; i < size; i++) {  // 将可能赢的情况都加1
        for (let j = 0; j < size; j++){
            if (chessBoard[i][j] === false){
                empty_num += 1
            }
        }
    }
    if (empty_num === size * size) {
        resultTxt.innerHTML = '你赢了！';
    }
};

let oneStep = function(i, j) {
    let pawn_center_offset = (side_len - margin * 2) / size / 2 + margin;
    context.beginPath();
    context.arc(pawn_center_offset + i * (unit_len - offset), pawn_center_offset + j * (unit_len - offset), radius, 0, 2 * Math.PI);  // 画圆
    context.closePath();
    context.fillStyle = '#111199';
    context.fill();
};

function deleteStep(i, j) {
    let startdeleteX = margin * 2 + (unit_len - offset) * i;
    let startdeleteY = margin * 2 + (unit_len - offset) * j;
    context.clearRect(startdeleteX, startdeleteY, unit_len - margin * 2, unit_len - margin * 2);
}

// 游戏框
function drawChessBoard() {
    for (let i = 0; i < size + 1; i++) {
        context.moveTo(margin + i * (unit_len - offset), margin);
        context.lineTo(margin + i * (unit_len - offset), side_len - margin);
        context.moveTo(margin, margin + i * (unit_len - offset));
        context.lineTo(side_len - margin , margin + i * (unit_len - offset));
        context.stroke();
    }
}

function updateChessBoard(curLoc) {
    let x_axis = curLoc[0];
    let y_axis = curLoc[1];

    // 判断左侧是否合理
    if (x_axis - 1 >= 0 && x_axis - 1 < size) {
        flip(x_axis - 1, y_axis)
    }
    // 判断右侧是否合理
    if (x_axis + 1 >= 0 && x_axis + 1 < size) {
        flip(x_axis + 1, y_axis)
    }
    // 判断下侧是否合理
    if (y_axis - 1 >= 0 && y_axis - 1 < size) {
        flip(x_axis, y_axis - 1)
    }
    // 判断上侧是否合理
    if (y_axis + 1 >= 0 && y_axis + 1 < size) {
        flip(x_axis, y_axis + 1)
    }
}

// 翻转(有棋子变成没棋子，没棋子变成有棋子)
function flip(x, y) {
    if (chessBoard[x][y] === true) {
        deleteStep(x, y)
    } else {
        oneStep(x, y)
    }
    chessBoard[x][y] = !chessBoard[x][y]
}