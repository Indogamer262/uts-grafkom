// 2472018 - Kevin Kornelius Martadinata
import * as std from "../lib/std.js"

export default class BoardUI {
    constructor(newWidth, newHeight, image_data, context, lib) {
        this.width = newWidth;
        this.height = newHeight;
        this.image_data = image_data;
        this.context = context;
        this.cgl = lib.cgl;
        this.cmx = lib.cmx;

        // menentukan posisi dan ukuran papan permainan
        this.boardX = 50;
        this.boardY = 50;
        this.boardSize = 400;
        this.cellSize = 85;
        this.gap = 12;
    }

    // menentukan warna tile sesuai dengan valuenya
    getTileColor(value) {
        switch(value) {
            case 0:
                return std.color.tileEmpty;
            case 2:
                return std.color.paleBeige;
            case 4:
                return std.color.creamBeige;
            case 8:
                return std.color.apricotOrange;
            case 16:
                return std.color.salmonOrange;
            case 32:
                return std.color.coralOrange;
            case 64:
                return std.color.orangeRed;
            case 128:
                return std.color.goldenYellow;
            case 256:
                return std.color.mustardYellow;
            case 512:
                return std.color.deepGoldenYellow;
            case 1024:
                return std.color.gold;
            case 2048:
                return std.color.brightGold;
            default:
                return std.color.darkCharcoal;
        }
    }

    // menentukan koordinat tile berdasarkan baris dan kolom
    getCellCoords(row,col) {
        let x = this.boardX + this.gap + col * (this.cellSize + this.gap);
        let y = this.boardY + this.gap + row * (this.cellSize + this.gap);
        return [x,y];
    }

    // menggambar background papan permainan
    drawBackground() {
        this.cgl.clearCanvas();
        this.cgl.kotak(this.boardX, this.boardY, this.boardSize, this.boardSize, std.color.darkGray);

        // menentukan titik untuk garis tepi papan
        let borderPoints = [
            [this.boardX, this.boardY],
            [this.boardX + this.boardSize, this.boardY],
            [this.boardX + this.boardSize, this.boardY + this.boardSize],
            [this.boardX, this.boardY + this.boardSize]
        ];
        this.cgl.polygon(borderPoints,std.color.black);
    }

    // menggambar satu kotak tile beserta garis tepinya
    drawTile(x,y,size,value) {
        this.cgl.kotak(x, y, size, size, this.getTileColor(value));

        // menentukan titik untuk garis tepi tile
        let tileBorder = [
            [x, y],
            [x + size, y],
            [x + size, y + size],
            [x, y + size]
        ];
        this.cgl.polygon(tileBorder,std.color.black);
    }

    // menggambar seluruh grid tile (4x4) beserta valuenya pada papan permainan
    drawBoardGrid(grid,fontAnimInstance) {
        for (let row = 0; row < 4; row++) {
            for (let col = 0; col < 4; col++) {
                // mengambil posisi dan nilai tile
                let pos = this.getCellCoords(row,col);
                let value = grid[row][col];
                this.drawTile(pos[0],pos[1],this.cellSize,value);

                // menggambar angka jika tile tidak kosong
                if (value > 0) {
                    let centerX = Math.floor(pos[0] + this.cellSize / 2);
                    let centerY = Math.floor(pos[1] + this.cellSize / 2);
                    fontAnimInstance.drawNumberCentered(value,centerX,centerY,std.color.darkCharcoal);
                }
            }
        }
    }

    // menggambar panel skor
    drawScorePanel(score,fontAnimInstance) {
        let panelX = 460;
        let panelY = 50;
        let panelWidth = 120;
        let panelHeight = 80;
        this.cgl.kotak(panelX, panelY, panelWidth, panelHeight, std.color.darkGray);

        // menentukan titik untuk garis tepi panel
        let borderPoints = [
            [panelX, panelY],
            [panelX + panelWidth, panelY],
            [panelX + panelWidth, panelY + panelHeight],
            [panelX, panelY + panelHeight]
        ];
        this.cgl.polygon(borderPoints,std.color.black);

        // menampilkan tulisan SCORE dan nilainya
        fontAnimInstance.drawText("SCORE", panelX + 25, panelY + 25, 1, std.color.white);
        fontAnimInstance.drawText(String(score), panelX + 35, panelY + 55, 1, std.color.white);
    }

    // menggambar banner jika pemain menang atau permainan selesai
    drawStatusOverlay(status,fontAnimInstance) {
        if (status === "WIN" || status === "GAMEOVER") {
            let bannerWidth = 300;
            let bannerHeight = 100;
            let bannerX = this.boardX + Math.floor((this.boardSize - bannerWidth) / 2);
            let bannerY = this.boardY + Math.floor((this.boardSize - bannerHeight) / 2);
            let bannerColor;
            let textColor;
            let text;

            // menentukan warna dan tulisan sesuai dengan status permainan
            if (status === "WIN") {
                bannerColor = std.color.goldenYellow;
                textColor = std.color.darkCharcoal;
                text = "YOU WIN";
            } else {
                bannerColor = std.color.darkCharcoal;
                textColor = std.color.white;
                text = "GAME OVER";
            }
            this.cgl.kotak(bannerX, bannerY, bannerWidth, bannerHeight, bannerColor);

            // menentukan titik untuk garis tepi banner
            let borderPoints = [
                [bannerX, bannerY],
                [bannerX + bannerWidth, bannerY],
                [bannerX + bannerWidth, bannerY + bannerHeight],
                [bannerX, bannerY + bannerHeight]
            ];
            this.cgl.polygon(borderPoints,std.color.black);

            // menampilkan tulisan status permainan
            fontAnimInstance.drawText(text, bannerX + 50, bannerY + 45, 1, textColor);
        }
    }

    // menggambar tampilan permainan
    main(grid,score,status,fontAnimInstance) {
        this.drawBackground();
        this.drawBoardGrid(grid,fontAnimInstance);
        this.drawScorePanel(score,fontAnimInstance);
        this.drawStatusOverlay(status,fontAnimInstance);
        this.context.putImageData(this.image_data,0,0);
    }
}