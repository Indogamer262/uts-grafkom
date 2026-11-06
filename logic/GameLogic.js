// 2472007 - Richard Vincentius Christian Dinata

import * as std from "../lib/std.js" // pengambilan var standar warna dari fie std.js dari folder lib

export default class GameLogic { // membuat class GameLogic
    constructor(newWidth, newHeight, image_data, context, lib) {
        this.width = newWidth;
        this.height = newHeight;
        this.image_data = image_data;
        this.context = context;
        this.cgl = lib.cgl; //library gambar dari ChealseaGL
        this.cmx = lib.cmx; //library matrix dari ChealseaGL

        this.grid = [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]]; // papan 2048 ukuran 4x4, angka 0 = kotak kosong
        this.score = 0; // skor awal 0
        this.status = "PLAYING"; //status awal game sedang berjalan
        this.isAnimating = false; // status animasi berjalan atau tidak
    }

    main() { // fungsi utama game 2048
        const that = this;
        // MERESET GRID MENJADI 0 
        function initGame() { // fungsi untuk mengiinisiasi awal game
            that.grid = [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]]; // mengksongkan semua isi papan 4x4 jadi 0
            that.score = 0; //buat skor jadi 0
            that.status = "PLAYING"; //membuat status balik lagi ke 0
            for (let i = 0; i < 2; i++) { // perulangan 2 kali untuk memunculkan 2 angka pertama
                spawnRandomTile(); //panggil fungsi buat taruh angka acak di papan
            }
        }

        // MENCARI SEMUA KOORDINAT YANG MASIH KOSONG
        function spawnRandomTile() {  // fungsi buat cari kotak kosong dan isi angka 2 atau 4
            let emptyCells = []; // tampungan array menyimpan koordinat [baris, kolom] yg masih 0
            for (let i = 0; i < 4; i++) { // perulangan 4 kali untuk baris
                for (let j = 0; j < 4; j++) { // perulangan 4 kali untuk kolom
                    if (that.grid[i][j] == 0) { // jika kotak kosong
                        emptyCells.push([i, j]); // masukkan koordinatnya ke emptyCells
                    }
                }
            }
            if (emptyCells.length > 0) { // jika ada kotak kosong
                let randomIndex = that.cgl.randomInt(0, emptyCells.length - 1); // pilih satu koordinat acak dari emptyCells
                let row = emptyCells[randomIndex][0]; // ambil barisnya
                let col = emptyCells[randomIndex][1]; // ambil kolomnya
                if (that.cgl.randomInt(1, 10) <= 9) { // acak angka 1-10, kalau 1-9
                    that.grid[row][col] = 2; // isi kotak dengan angka 2
                } else { // kalau keluar angka 10
                    that.grid[row][col] = 4; // isi kotak dengan angka 4
                }
                return [row, col, that.grid[row][col]]; // kembalikan posisi baris, kolom, dan angkanya
            }
        }

        //FUNGSI INTI GAMEBOY 2048 PER 1 BARIS
        function slideAndMergeRow(row) { // fungsi geser dan gabung angka dlm 1 row ke kiri
            let newRow = []; // array penampung utk angka bukan 0
            for (let i = 0; i < row.length; i++) { // pengecekan tiap angka di dalam baris
                if (row[i] != 0) { //kalau angka bukan 0
                    newRow.push(row[i]); //masukkan ke newRow supaya ke kiri
                }
            }
            for (let i = 0; i < newRow.length - 1; i++) { //cek angka yang bersebelahan
                if (newRow[i] == newRow[i + 1]) { //kalau angka sekarang sama dgn sebelah kanannya
                    newRow[i] *= 2; //gabungkan angkanya (dikali 2)
                    that.score += newRow[i]; //tambahin angka gabungannya ke angka skor
                    newRow[i + 1] = 0; //kosongkan angka di sebelahnya jadi 0
                }
            }
            let hasil = []; //array penambung hasil utk merapatkan lagi setelah digabung
            for (let i = 0; i < newRow.length; i++) { //cek ulang isi newRow
                if (newRow[i] != 0) { //ambil yg bukan 0 
                    hasil.push(newRow[i]); // masukkan ke array hasil
                }
            }
            while (hasil.length < 4) { //selama jumlah angka di baris blm 4
                hasil.push(0); // tambahkan angka 0 di belakangnya sampai angkanya 4
            }
            return hasil; //kembalikan baris hasil pergeserannya
        }

        //FUNGSI GESER SELURUH PAPAN SESUAI DENGAN ARAH YANG DIINGINKAN
        function move(direction) {
            for (let i = 0; i < 4; i++) {  //pengulangan 4 kali buat poses baris/kolom
                if (direction == "left") { // kalau arahnya ke kiri
                    that.grid[i] = slideAndMergeRow(that.grid[i]); //langsung geser baris ke-i ke kii
                } else if (direction == "right") { // kalau arahnya ke kanan
                    let reversedRow = that.grid[i].reverse(); //balikkan urutan barisnya dari kanan ke kiri
                    reversedRow = slideAndMergeRow(reversedRow); //geser dan gabungkan baris yang sudah dibalik
                    that.grid[i] = reversedRow.reverse(); //balikin lagi ke urutan kanan
                } else if (direction == "up") { //kalau arahnya ke atas
                    let col = [that.grid[0][i], that.grid[1][i], that.grid[2][i], that.grid[3][i]]; //ambil 4 angka di kolom ke-i dari atas ke bawah
                    col = slideAndMergeRow(col); //geser dan gabungkan kolom
                    for (let j = 0; j < 4; j++) { //pengulangan buat kembalikan hasil ke kolom semula
                        that.grid[j][i] = col[j]; // masukkan kembali angkanya ke baris j kolom i
                    }
                } else if (direction == "down") { //kalau arahnya ke bawah
                    let col = [that.grid[0][i], that.grid[1][i], that.grid[2][i], that.grid[3][i]]; //ambil 4 angka di kolom ke-i dari atas ke bawah
                    col = slideAndMergeRow(col.reverse()).reverse(); //geser dan gabungkan kolom yang sudah dibalik
                    for (let j = 0; j < 4; j++) { //pengulangan buat kembalikan hasil ke kolom semula
                        that.grid[j][i] = col[j]; // masukkan kembali angkanya ke baris j kolom i
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
                    if (that.grid[i][j] == 2048) { //kalau ada angka yang nilainya mencapai2048
                        that.status = "WIN"; // ubah status jadi WIN
                        return; //berhenti karena sudah menang
                    } else if (that.grid[i][j] == 0) { //kalau ada angka 0
                        that.status = "PLAYING"; //status masih bisa main
                        return; //berhenti karena status masih bisa main
                    } else if ((j < 3 && that.grid[i][j] == that.grid[i][j + 1]) || (i < 3 && that.grid[i][j] == that.grid[i + 1][j])) { //kalau ada angka yang sama bersebelahan
                        that.status = "PLAYING"; //status masih bisa main
                        return; //hentikan pengecekan
                    }
                }
            }
            that.status = "GAME OVER";
        }

        //MENGHUBUNGKAN 5 TOMBOL YANG ADA DI INDEX.HTML DENGAN FUNGSI YANG ADA DI ATAS
        function bindInputs() {
            document.getElementById("upBtn").addEventListener("click", function () { move("up"); }); // klik tombol atas jalankan move up
            document.getElementById("downBtn").addEventListener("click", function () { move("down"); }); // klik tombol bawah jalankan move down
            document.getElementById("leftBtn").addEventListener("click", function () { move("left"); }); // klik tombol kiri jalankan move left
            document.getElementById("rightBtn").addEventListener("click", function () { move("right"); }); // klik tombol kanan jalankan move right
            document.getElementById("restartBtn").addEventListener("click", function () { initGame(); }); // klik tombol restart utk mengulangi permainan
            document.addEventListener("keydown", function (e) {
                if (e.key === "ArrowUp") { // kalau tekan panah atas
                    move("up"); // geser ke atas
                } else if (e.key === "ArrowDown") { //kalau tekan panah bawah
                    move("down"); // geser ke bawah
                } else if (e.key === "ArrowLeft") { //kalau tekan panah kiri
                    move("left"); // geser ke kiri
                } else if (e.key === "ArrowRight") { //kalau tekan panah kanan
                    move("right"); // geser ke kanan
                }
            });
        }
        bindInputs(); // aktifkan semua tombol kontrolnya
        initGame(); // mulai permainan pertama kali
    }
}