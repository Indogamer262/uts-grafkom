// 2472007 - Richard Vincentius Christian Dinata

import * as std from "../lib/std.js" // pengambilan var standar warna dari fie std.js dari folder lib

export default class GameLogic { // membuat class GameLogic
    constructor(newWidth, newHeight, image_data, context, lib) {
        this.width = newWidth;
        this.height = newHeight;
        this.image_data = image_data;
        this.context = context;
        this.cgl = lib.cgl;
        this.cmx = lib.cmx;

        this.grid = [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]]; // papan 2048 ukuran 4x4, angka 0 = kotak kosong
        this.score = 0;
        this.status = "PLAYING";
        this.isAnimating = false;
    }

    // MERESET GRID MENJADI 0 
    initGame() { // fungsi untuk mengiinisiasi awal game
        this.grid = [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]];
        this.score = 0;
        this.status = "PLAYING";
        for (let i = 0; i < 2; i++) { // perulangan 2 kali untuk memunculkan 2 angka pertama
            this.spawnRandomTile(); //panggil fungsi buat taruh angka acak di papan
        }
    }

    getGameStat() {
        return {
            grid:this.grid,
            score:this.score,
            status:this.status,
            isAnimating:this.isAnimating
        }
    }

    // MENCARI SEMUA KOORDINAT YANG MASIH KOSONG
    spawnRandomTile() {
        let emptyCells = []; // tampungan array menyimpan koordinat [baris, kolom] yg masih 0
        for (let i = 0; i < 4; i++) { // perulangan 4 kali untuk baris
            for (let j = 0; j < 4; j++) { // perulangan 4 kali untuk kolom
                if (this.grid[i][j] == 0) {
                    emptyCells.push([i, j]);
                }
            }
        }
        if (emptyCells.length > 0) { // jika ada kotak kosong
            let randomIndex = this.cgl.randomInt(0, emptyCells.length - 1);
            let row = emptyCells[randomIndex][0];
            let col = emptyCells[randomIndex][1];
            if (this.cgl.randomInt(1, 10) <= 9) {
                this.grid[row][col] = 2;
            } else { // kalau keluar angka 10
                this.grid[row][col] = 4;
            }
            return [row, col, this.grid[row][col]];
        }
    }

    //FUNGSI INTI GAMEBOY 2048 PER 1 BARIS
    slideAndMergeRow(row) { // fungsi geser dan gabung angka dlm 1 row ke kiri
        let newRow = []; // array penampung utk angka bukan 0
        for (let i = 0; i < row.length; i++) {
            if (row[i] != 0) {
                newRow.push(row[i]);
            }
        }
        for (let i = 0; i < newRow.length - 1; i++) { //cek angka yang bersebelahan
            if (newRow[i] == newRow[i + 1]) { //kalau angka sekarang sama dgn sebelah kanannya
                newRow[i] *= 2;
                this.score += newRow[i];
                newRow[i + 1] = 0;
            }
        }
        let hasil = []; //array penambung hasil utk merapatkan lagi setelah digabung
        for (let i = 0; i < newRow.length; i++) {
            if (newRow[i] != 0) {
                hasil.push(newRow[i]);
            }
        }
        while (hasil.length < 4) {
            hasil.push(0);
        }
        return hasil;
    }

    //FUNGSI GESER SELURUH PAPAN SESUAI DENGAN ARAH YANG DIINGINKAN
    move(direction) {
        for (let i = 0; i < 4; i++) {  //pengulangan 4 kali buat poses baris/kolom
            if (direction == "left") {
                this.grid[i] = this.slideAndMergeRow(this.grid[i]);
            } else if (direction == "right") {
                let reversedRow = this.grid[i].reverse();
                reversedRow = this.slideAndMergeRow(reversedRow);
                this.grid[i] = reversedRow.reverse();
            } else if (direction == "up") {
                let col = [this.grid[0][i], this.grid[1][i], this.grid[2][i], this.grid[3][i]];
                col = this.slideAndMergeRow(col);
                for (let j = 0; j < 4; j++) {
                    this.grid[j][i] = col[j];
                }
            } else if (direction == "down") {
                let col = [this.grid[0][i], this.grid[1][i], this.grid[2][i], this.grid[3][i]];
                col = this.slideAndMergeRow(col.reverse()).reverse();
                for (let j = 0; j < 4; j++) {
                    this.grid[j][i] = col[j];
                }
            }
        }
        this.spawnRandomTile(); // munculkan 1 angka acak baru setelah papan digeser
        this.checkGameStatus(); // cek apakah sudah menang/game over
    }

    //CEK GAME STATUS APAKAH WIN ATAU GAME OVER
    checkGameStatus() { //cek status apakah sudah menang atau game over
        for (let i = 0; i < 4; i++) { //perulangan 4 kali untuk baris
            for (let j = 0; j < 4; j++) { //perulangan 4 kali untuk kolom
                if (this.grid[i][j] == 2048) {
                    this.status = "WIN";
                    return;
                } else if (this.grid[i][j] == 0) {
                    this.status = "PLAYING";
                    return;
                } else if ((j < 3 && this.grid[i][j] == this.grid[i][j + 1]) || (i < 3 && this.grid[i][j] == this.grid[i + 1][j])) { //kalau ada angka yang sama bersebelahan
                    this.status = "PLAYING";
                    return;
                }
            }
        }
        this.status = "GAMEOVER";
    }

    //MENGHUBUNGKAN 5 TOMBOL YANG ADA DI INDEX.HTML DENGAN FUNGSI YANG ADA DI ATAS
    bindInputs() {
        document.getElementById("upBtn").addEventListener("click", () => { this.move("up");this.updateUI(); });
        document.getElementById("downBtn").addEventListener("click", () => { this.move("down");this.updateUI(); });
        document.getElementById("leftBtn").addEventListener("click", () => { this.move("left");this.updateUI(); });
        document.getElementById("rightBtn").addEventListener("click", () => { this.move("right");this.updateUI(); });
        document.getElementById("restartBtn").addEventListener("click", () => { this.initGame();this.updateUI(); });
        document.addEventListener("keydown", (e) => {
            if (e.key === "ArrowUp") {
                this.move("up");
                this.updateUI();
            } else if (e.key === "ArrowDown") {
                this.move("down");
                this.updateUI();
            } else if (e.key === "ArrowLeft") {
                this.move("left");
                this.updateUI();
            } else if (e.key === "ArrowRight") {
                this.move("right");
                this.updateUI();
            }
        });
    }

    // update to the Kevin's BoardUI
    // intinya mah kasih tau BoardUI yang punyanya kevin, ada state baru, biar dia ngeupdate tampilannya
    updateUI() {
        this.boardUI.main(this.grid, this.score, this.status, this.fontAnim);
    }
    
    main(boardUI, fontAnim) {
        this.bindInputs(); // aktifkan semua tombol kontrolnya
        this.initGame(); // mulai permainan pertama kali

        this.boardUI = boardUI
        this.fontAnim = fontAnim

        this.updateUI(boardUI, fontAnim);
    }
}