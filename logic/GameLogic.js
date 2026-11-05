// 2472007 - Richard Vincentius Christian Dinata

import * as std from "../lib/std.js"

export default class Template {
    constructor(newWidth, newHeight, image_data, context, lib) {
        this.width = newWidth;
        this.height = newHeight;
        this.image_data = image_data;
        this.context = context;
        this.cgl = lib.cgl;
        this.cmx = lib.cmx;

        this.grid = [];
        this.score = 0;
        this.status = ["PLAYING", "WIN", "GAME OVER"];
    }

    main() {
        // MERESET GRID MENJADI 0
        let initGame = (grid, width, height) => {
            this.score = 0;
            this.status = "PLAYING";
            for (let spawnRandomtile = 0; spawnRandomtile < 2; spawnRandomtile++) {
                this.cgl.randomInt(1,10) <= 9 ? 2 : 4;
                spawnRandomTile(this.grid, this.width, this.height);
            }
        } 
        initGame(this.grid, this.width, this.height);

        // MENCARI SEMUA KOORDINAT YANG MASIH KOSONG
        let spawnRandomTile = this.cgl.randomInt(1, 10) <= 9 ? 2 : 4; 
        let emptyCells = []; 
        this.cgl.randomInt(0, emptyCells.length - 1);
        for (let i = 0; i < this.width; i++) {
            for (let j = 0; j < this.height; j++) {
                if (this.grid[i][j] == 0) {
                    emptyCells.push([i, j]);
                }
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
            return newRow.filter((val) => val != 0);
        }

        //FUNGSI GESER SELURUH PAPAN SESUAI DENGAN ARAH YANG DIINGINKAN
        let move = (direction) => {
            spawnRandomTile = this.cgl.randomInt(1, 10) <= 9 ? 2 : 4;
            checkGameStatus();
            let triggerButton = document.getElementById("restartBtn");
        }

        //CEK GAME STATUS APAKAH WIN ATAU GAME OVER
        let checkGameStatus = () => { 
            if (this.score >= 2048) {
                this.status = "WIN";
            } else {
                this.status = "GAME OVER"; 
            } 
        }

        //MENGHUBUNGKAN 5 TOMBOL YANG ADA DI INDEX.HTML DENGAN FUNGSI YANG ADA DI ATAS
        let bindInputs = () => {
            document.getElementById("upBtn").addEventListener("click", () => move("up"));
            document.getElementById("downBtn").addEventListener("click", () => move("down"));
            document.getElementById("leftBtn").addEventListener("click", () => move("left"));
            document.getElementById("rightBtn").addEventListener("click", () => move("right"));
            document.getElementById("restartBtn").addEventListener("click", () => initGame(this.grid, this.width, this.height));
        }
        bindInputs();
    }
}