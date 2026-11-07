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

    main() {
        this.drawBackground();
        this.context.putImageData(this.image_data,0,0);
    }
}
