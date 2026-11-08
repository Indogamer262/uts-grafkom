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

        this.boardX = 50;
        this.boardY = 50;
        this.boardSize = 400;
        this.cellSize = 85;
        this.gap = 12;
    }

    // menentukan warna tile
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

    // menentukan koordinat tile pada canvas
    getCellCoords(row,col) {
        let x = this.boardX + this.gap + col * (this.cellSize + this.gap);
        let y = this.boardY + this.gap + row * (this.cellSize + this.gap);
        let coords = [x,y];
        coords.x = x;
        coords.y = y;
        return coords;
    }

    // menggambar latar belakang permainan
    drawBackground() {
        this.cgl.clearCanvas();
        this.cgl.kotak(this.boardX, this.boardY, this.boardSize, this.boardSize, std.color.darkGray);
        let borderPoints = [
            [this.boardX, this.boardY],
            [this.boardX + this.boardSize, this.boardY],
            [this.boardX + this.boardSize, this.boardY + this.boardSize],
            [this.boardX, this.boardY + this.boardSize]
        ];
        this.cgl.polygon(borderPoints,std.color.black);
    }

    // menggambar tile pada papan permainan
    drawTile(x,y,size,value) {
        this.cgl.kotak(x,y,size,size,this.getTileColor(value));
        let tileBorder = [
            [x, y],
            [x + size, y],
            [x + size, y + size],
            [x, y + size]
        ];
        this.cgl.polygon(tileBorder,std.color.black);
    }

    // menggambar seluruh grid tile pada papan permainan
    drawBoardGrid(grid,fontAnimInstance) {
        for (let row = 0; row < 4; row++) {
            for (let col = 0; col < 4; col++) {
                let pos = this.getCellCoords(row,col);
                let value = grid[row][col];
                this.drawTile(pos[0],pos[1],this.cellSize,value);

                if (value > 0) {
                    let centerX = Math.floor(pos[0] + this.cellSize / 2);
                    let centerY = Math.floor(pos[1] + this.cellSize / 2);
                    // fontAnimInstance.drawNumberCentered(value,centerX,centerY,std.color.darkCharcoal);
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

        this.cgl.kotak(panelX,panelY,panelWidth,panelHeight,std.color.darkGray);
        let borderPoints = [
            [panelX, panelY],
            [panelX + panelWidth, panelY],
            [panelX + panelWidth, panelY + panelHeight],
            [panelX, panelY + panelHeight]
        ];
        this.cgl.polygon(borderPoints,std.color.black);
        // fontAnimInstance.drawText("SCORE", panelX + 25, panelY + 25, 1, std.color.white);
        // fontAnimInstance.drawText(String(score), panelX + 35, panelY + 55, 1, std.color.white);
    }

    main() {
        this.drawBackground();
        this.context.putImageData(this.image_data,0,0);
    }
}
