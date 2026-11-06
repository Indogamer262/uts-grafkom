// 2472007 - Richard Vincentius Christian Dinata

import * as std from "../lib/std.js"

export default class GameLogic {
    constructor(newWidth, newHeight, image_data, context, lib) {
        this.width = newWidth;
        this.height = newHeight;
        this.image_data = image_data;
        this.context = context;
        this.cgl = lib.cgl;
        this.cmx = lib.cmx;

        this.grid = [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]];
        this.score = 0;
        this.status = "PLAYING";
        this.isAnimating = false;
    }

    main() {
        // MERESET GRID MENJADI 0
        let initGame = (grid, width, height) => {
            this.grid = [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]];
            this.score = 0;
            this.status = "PLAYING";
            for (let i = 0; i < 2; i++) {
                spawnRandomTile(this.grid, this.width, this.height);
            }
        }

        // MENCARI SEMUA KOORDINAT YANG MASIH KOSONG
        let spawnRandomTile = (grid, width, height) => {
            let emptyCells = [];
            for (let i = 0; i < 4; i++) {
                for (let j = 0; j < 4; j++) {
                    if (this.grid[i][j] == 0) {
                        emptyCells.push([i, j]);
                    }
                }
            }
            if (emptyCells.length > 0) {
                let [row, col] = emptyCells[this.cgl.randomInt(0, emptyCells.length - 1)];
                this.grid[row][col] = this.cgl.randomInt(1, 10) <= 9 ? 2 : 4;
                return [row, col, this.grid[row][col]];
            }
        }

        //FUNGSI INTI GAMEBOY 2048 PER 1 BARIS
        let slideAndMergeRow = (row) => {
            let newRow = row.filter((val) => val != 0);
            for (let i = 0; i < newRow.length - 1; i++) {
                if (newRow[i] == newRow[i + 1]) {
                    newRow[i] *= 2;
                    this.score += newRow[i];
                    newRow[i + 1] = 0;
                }
            }
            newRow = newRow.filter((val) => val != 0);
            while (newRow.length < 4) {
                newRow.push(0);
            }
            return newRow;
        }

        //FUNGSI GESER SELURUH PAPAN SESUAI DENGAN ARAH YANG DIINGINKAN
        let move = (direction) => {
            for (let i = 0; i < 4; i++) {
                if (direction == "left") {
                    this.grid[i] = slideAndMergeRow(this.grid[i]);
                } else if (direction == "right") {
                    let reversedRow = [...this.grid[i]].reverse();
                    reversedRow = slideAndMergeRow(reversedRow);
                    this.grid[i] = reversedRow.reverse();
                } else if (direction == "up") {
                    let col = [this.grid[0][i], this.grid[1][i], this.grid[2][i], this.grid[3][i]];
                    col = slideAndMergeRow(col);
                    for (let j = 0; j < 4; j++) {
                        this.grid[j][i] = col[j];
                    }
                } else if (direction == "down") {
                    let col = [this.grid[0][i], this.grid[1][i], this.grid[2][i], this.grid[3][i]];
                    col = slideAndMergeRow(col.reverse()).reverse();
                    for (let j = 0; j < 4; j++) {
                        this.grid[j][i] = col[j];
                    }
                }
            }
            spawnRandomTile(this.grid, this.width, this.height);
            checkGameStatus();
        }

        //CEK GAME STATUS APAKAH WIN ATAU GAME OVER
        let checkGameStatus = () => {
            for (let i = 0; i < 4; i++) {
                for (let j = 0; j < 4; j++) {
                    if (this.grid[i][j] == 2048) {
                        this.status = "WIN";
                        return;
                    } else if (this.grid[i][j] == 0) {
                        this.status = "PLAYING";
                        return;
                    } else if ((j < 3 && this.grid[i][j] == this.grid[i][j + 1]) || (i < 3 && this.grid[i][j] == this.grid[i + 1][j])) {
                        this.status = "PLAYING";
                        return;
                    }
                }
            }
            this.status = "GAME OVER";
        }

        //MENGHUBUNGKAN 5 TOMBOL YANG ADA DI INDEX.HTML DENGAN FUNGSI YANG ADA DI ATAS
        let bindInputs = () => {
            document.getElementById("upBtn").addEventListener("click", () => move("up"));
            document.getElementById("downBtn").addEventListener("click", () => move("down"));
            document.getElementById("leftBtn").addEventListener("click", () => move("left"));
            document.getElementById("rightBtn").addEventListener("click", () => move("right"));
            document.getElementById("restartBtn").addEventListener("click", () => initGame(this.grid, this.width, this.height));
            document.addEventListener("keydown", (e) => {
                if (e.key === "ArrowUp") {
                    move("up");
                } else if (e.key === "ArrowDown") {
                    move("down");
                } else if (e.key === "ArrowLeft") {
                    move("left");
                } else if (e.key === "ArrowRight") {
                    move("right");
                }
            });
        }
        bindInputs();
        initGame(this.grid, this.width, this.height);
    }
}