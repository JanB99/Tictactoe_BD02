const canvas = document.getElementById("canvas")
const ctx = canvas.getContext("2d")

canvas.width = 500
canvas.height = 500

const size = 3

const w = canvas.width / size
const h = canvas.height / size

let grid = []

for (let i = 0; i < size; i++) {
    grid.push([])
    for (let j = 0; j < size; j++) {
        grid[i].push('')
    }
}

let player1 = 'X'
let player2 = 'O'

let winner = checkWinner(grid)

function animate() {

    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {

            ctx.strokeRect(w * i, h * j, w, h);

            if (grid[i][j] == 'O') {
                ctx.beginPath();
                ctx.arc(w * i + w / 2, h * j + h / 2, w / 4, 0, Math.PI * 2);
                ctx.stroke();
            } else if (grid[i][j] == 'X') {
                ctx.beginPath();
                ctx.moveTo(w * i + w / 4, h * j + h / 4);
                ctx.lineTo(w * i + w - w / 4, h * j + h - h / 4);

                ctx.moveTo(w * i + w / 4, h * j + h - h / 4);
                ctx.lineTo(w * i + w - w / 4, h * j + h / 4);
                ctx.stroke();
            }
        }
    }

    if (!winner) {
        requestAnimationFrame(animate)
    }
}

animate()

////////////////////////////////////////////////////////////
// gebruik van objecten om de game states op te slaan
// function minimaxOOP(pos, depth, isMaximizing) {
//     winner = pos.checkWinner()
//     if (depth == 0 || winner == 'X') {
//         pos.score = 1
//         return 1
//     } else if (depth == 0 || winner == 'O') {
//         pos.score = -1
//         return -1
//     } else if (depth == 0 || winner == 'tie') {
//         pos.score = 0
//         return 0
//     }
//     if (isMaximizing) {
//         let maxEval = -Infinity
//         pos.nextMoves.forEach(item => {
//             let eval = minimaxOOP(item, depth - 1, false)
//             maxEval = Math.max(maxEval, eval)
//         })
//         pos.score = maxEval
//         return maxEval
//     } else {
//         let minEval = Infinity
//         pos.nextMoves.forEach(item => {
//             let eval = minimaxOOP(item, depth - 1, true)
//             minEval = Math.min(minEval, eval)
//         })
//         pos.score = minEval
//         return minEval
//     }
// }
////////////////////////////////////////////////////////////

function minimax(pos, isMaximizing, alfa, beta, depth) {
    let winner = checkWinner(pos)
    if (winner == 'X') {
        return -1 - (depth/9)
    } else if (winner == 'O') {
        return 1 - (depth/9)
    } else if (winner == 'tie') {
        return 0
    }

    if (isMaximizing) {
        let maxEval = -Infinity
        outer : for (let i = 0; i < size; i++) {
            for (let j = 0; j < size; j++) {

                if (pos[i][j] == '') {
                    pos[i][j] = player2
                    let eval = minimax(pos, false, alfa, beta, depth + 1)
                    grid[i][j] = ''
                    maxEval = Math.max(maxEval, eval)
                    alfa = Math.max(alfa, eval)
                    if (beta <= alfa) {
                        break outer
                    }
                }
            }
        }
        return maxEval
    } else {
        let minEval = Infinity
        outer : for (let i = 0; i < size; i++) {
            for (let j = 0; j < size; j++) {

                if (pos[i][j] == '') {
                    pos[i][j] = player1
                    let eval = minimax(pos, true, alfa, beta, depth + 1)
                    grid[i][j] = ''
                    minEval = Math.min(minEval, eval)
                    beta = Math.min(beta, eval)
                    if (alfa >= beta) {
                        break outer
                    }
                }
            }
        }
        return minEval
    }

}

canvas.addEventListener('click', e => {

    if (!winner) {
        let i = Math.floor(e.x / w)
        let j = Math.floor(e.y / h)
        if (grid[i][j] == '') {
            grid[i][j] = player1
            if (checkWinner(grid)) {
                document.getElementById("text").innerHTML = checkWinner(grid)
                return
            }
            makeNextMove(player2)
            winner = checkWinner(grid)
            if (winner){
                document.getElementById("text").innerHTML = winner + " heeft gewonnen"
            }
            
        }
    }


})

function makeNextMove(ai) {

    console.time()
    let bestScore = -Infinity
    let move
    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {

            if (grid[i][j] == '') {
                grid[i][j] = ai
                let score = minimax(grid, false, -Infinity, Infinity, 0)
                grid[i][j] = ''
                if (score > bestScore) {
                    bestScore = score
                    move = { i, j }
                }

            }
        }
    }
    grid[move.i][move.j] = ai
    console.timeEnd();
}


function checkWinner(grid) {

    for (let i = 0; i < size; i++) {
        if (grid[i][0] != '' && grid[i][0] == grid[i][1] && grid[i][1] == grid[i][2]) {
            return grid[i][0];
        }

        if (grid[0][i] != '' && grid[0][i] == grid[1][i] && grid[1][i] == grid[2][i]) {
            return grid[0][i];
        }
    }

    if (grid[0][0] != '' && grid[0][0] == grid[1][1] && grid[1][1] == grid[2][2]) {
        return grid[0][0];
    }

    if (grid[0][2] != '' && grid[0][2] == grid[1][1] && grid[1][1] == grid[2][0]) {
        return grid[0][2];
    }

    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
            if (grid[i][j] == '') {
                return null
            }
        }
    }

    return 'tie';
}