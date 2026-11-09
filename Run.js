// GAMES ENTIRE WORKFLOW GOES HERE
import * as std from "../lib/std.js"

export default class Run {
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

    run(logic) {
        logic.gameLogic.initGame();

        let stat = logic.gameLogic.getGameStat();
        this.grid = stat.grid;
        this.score = stat.score;
        this.status = stat.status;
        this.isAnimating = stat.isAnimating;

        logic.boardUI.main(this.grid, this.score, this.status, logic.fontAnim)
    }
}