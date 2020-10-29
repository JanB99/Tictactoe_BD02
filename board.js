
class Board {

    constructor(size, depth, isX, grid) {
        this.nextMoves = []
        this.depth = depth
        this.isX = isX
        this.size = size
        this.score = null

        this.grid = grid ? grid : this.makeEmptyGrid()
         
        if (this.checkWinner() == null) {
            this.generateNextMoves()
        }
    }

    makeEmptyGrid() {
        let g = []
        for (let i = 0; i < this.size; i++) {
            g.push([])
            for (let j = 0; j < this.size; j++) {
                g[i][j] = '';
            }
        }
        return g
    }

    generateNextMoves() {

        for (let i = 0; i < this.size; i++) {
            for (let j = 0; j < this.size; j++) {

                let copyGrid = JSON.parse(JSON.stringify(this.grid))

                if (this.grid[i][j] == '') {
                    if (this.isX) {
                        copyGrid[i][j] = 'X';
                    } else {
                        copyGrid[i][j] = 'O';
                    }

                    this.nextMoves.push(new Board(this.size, this.depth + 1, !this.isX, copyGrid));
                }
            }
        }
    }

    checkWinner() {

        for (let i = 0; i < this.size; i++) {
            if (this.grid[i][0] != '' && this.grid[i][0] == this.grid[i][1] && this.grid[i][1] == this.grid[i][2]) {
                return this.grid[i][0];
            }

            if (this.grid[0][i] != '' && this.grid[0][i] == this.grid[1][i] && this.grid[1][i] == this.grid[2][i]) {
                return this.grid[0][i];
            }
        }

        if (this.grid[0][0] != '' && this.grid[0][0] == this.grid[1][1] && this.grid[1][1] == this.grid[2][2]) {
            return this.grid[0][0];
        }

        if (this.grid[0][2] != '' && this.grid[0][2] == this.grid[1][1] && this.grid[1][1] == this.grid[2][0]) {
            return this.grid[0][2];
        }

        for (let i = 0; i < this.size; i++) {
            for (let j = 0; j < this.size; j++) {
                if (this.grid[i][j] == ''){
                    return null
                }
            }
        }

        return 'tie';
    }
}