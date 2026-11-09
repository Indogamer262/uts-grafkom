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

    main() {
        const that = this; // variabel pengganti this biar bisa di dalam fungsi lokal
        // MERESET GRID MENJADI 0 
        function initGame() { // fungsi untuk mengiinisiasi awal game
            that.grid = [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]];
            that.score = 0;
            that.status = "PLAYING";
            for (let i = 0; i < 2; i++) { // perulangan 2 kali untuk memunculkan 2 angka pertama
                spawnRandomTile(); //panggil fungsi buat taruh angka acak di papan
            }
        }

        // MENCARI SEMUA KOORDINAT YANG MASIH KOSONG
        function spawnRandomTile() {
            let emptyCells = []; // tampungan array menyimpan koordinat [baris, kolom] yg masih 0
            for (let i = 0; i < 4; i++) { // perulangan 4 kali untuk baris
                for (let j = 0; j < 4; j++) { // perulangan 4 kali untuk kolom
                    if (that.grid[i][j] == 0) {
                        emptyCells.push([i, j]);
                    }
                }
            }
            if (emptyCells.length > 0) { // jika ada kotak kosong
                let randomIndex = that.cgl.randomInt(0, emptyCells.length - 1);
                let row = emptyCells[randomIndex][0];
                let col = emptyCells[randomIndex][1];
                if (that.cgl.randomInt(1, 10) <= 9) {
                    that.grid[row][col] = 2;
                } else { // kalau keluar angka 10
                    that.grid[row][col] = 4;
                }
                return [row, col, that.grid[row][col]];
            }
        }

        //FUNGSI INTI GAMEBOY 2048 PER 1 BARIS
        function slideAndMergeRow(row) { // fungsi geser dan gabung angka dlm 1 row ke kiri
            let newRow = []; // array penampung utk angka bukan 0
            for (let i = 0; i < row.length; i++) {
                if (row[i] != 0) {
                    newRow.push(row[i]);
                }
            }
            for (let i = 0; i < newRow.length - 1; i++) { //cek angka yang bersebelahan
                if (newRow[i] == newRow[i + 1]) { //kalau angka sekarang sama dgn sebelah kanannya
                    newRow[i] *= 2;
                    that.score += newRow[i];
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
        function move(direction) {
            for (let i = 0; i < 4; i++) {  //pengulangan 4 kali buat poses baris/kolom
                if (direction == "left") {
                    that.grid[i] = slideAndMergeRow(that.grid[i]);
                } else if (direction == "right") {
                    let reversedRow = that.grid[i].reverse();
                    reversedRow = slideAndMergeRow(reversedRow);
                    that.grid[i] = reversedRow.reverse();
                } else if (direction == "up") {
                    let col = [that.grid[0][i], that.grid[1][i], that.grid[2][i], that.grid[3][i]];
                    col = slideAndMergeRow(col);
                    for (let j = 0; j < 4; j++) {
                        that.grid[j][i] = col[j];
                    }
                } else if (direction == "down") {
                    let col = [that.grid[0][i], that.grid[1][i], that.grid[2][i], that.grid[3][i]];
                    col = slideAndMergeRow(col.reverse()).reverse();
                    for (let j = 0; j < 4; j++) {
                        that.grid[j][i] = col[j];
                    }
                }
            }
            spawnRandomTile(); // munculkan 1 angka acak baru setelah papan digeser
            checkGameStatus(); // cek apakah sudah menang/game over
        }

        //CEK GAME STATUS APAKAH WIN ATAU GAME OVER
        function checkGameStatus() { //cek status apakah sudah menang atau game over
            for (let i = 0; i < 4; i++) { //perulangan 4 kali untuk baris
                for (let j = 0; j < 4; j++) { //perulangan 4 kali untuk kolom
                    if (that.grid[i][j] == 2048) {
                        that.status = "WIN";
                        return;
                    } else if (that.grid[i][j] == 0) {
                        that.status = "PLAYING";
                        return;
                    } else if ((j < 3 && that.grid[i][j] == that.grid[i][j + 1]) || (i < 3 && that.grid[i][j] == that.grid[i + 1][j])) { //kalau ada angka yang sama bersebelahan
                        that.status = "PLAYING";
                        return;
                    }
                }
            }
            that.status = "GAME OVER";
        }

        //MENGHUBUNGKAN 5 TOMBOL YANG ADA DI INDEX.HTML DENGAN FUNGSI YANG ADA DI ATAS
        function bindInputs() {
            document.getElementById("upBtn").addEventListener("click", function () { move("up"); });
            document.getElementById("downBtn").addEventListener("click", function () { move("down"); });
            document.getElementById("leftBtn").addEventListener("click", function () { move("left"); });
            document.getElementById("rightBtn").addEventListener("click", function () { move("right"); });
            document.getElementById("restartBtn").addEventListener("click", function () { initGame(); });
            document.addEventListener("keydown", function (e) {
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
        bindInputs(); // aktifkan semua tombol kontrolnya
        initGame(); // mulai permainan pertama kali
    }
}