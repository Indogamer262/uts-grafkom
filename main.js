// Main files for integrating the whole modules

// ===========================================================
// CANVAS DEFINITION
// ===========================================================
const canvas_handler = document.querySelector("#mycanvas");
const context = canvas_handler.getContext("2d");

// get image data
const image_data = context.getImageData(
    0,0, //get image from this starting x, y
    canvas_handler.width, //width of image
    canvas_handler.height,
);

// ===========================================================
// LIBRARY INTEGRATION
// ===========================================================
// import * as cgl from "./ChrisGL.js";
import ChelseaGL from "./lib/ChrisGL.js";
import ChelseaMatrix from "./lib/ChelseaMatrix.js"
import * as std from "./lib/std.js"

// ===========================================================
// LOGIC INTEGRATION
// ===========================================================
// internal
//import Run from "./Run.js"

// external
import Template from "./logic/template.js"
import Scene from "./logic/Scene.js"
import GameLogic from "./logic/GameLogic.js"
import BoardUI from "./logic/BoardUI.js"
import FontAnim from "./logic/FontAnim.js"

// ===========================================================
// OBJECT DECLARATION
// ===========================================================
// Libraries Object
let cgl = new ChelseaGL(canvas_handler.width, canvas_handler.height, image_data);
let cmx = new ChelseaMatrix();
cgl.clearCanvas();

// la stands for Logic Arguments
const la = {
    cw: canvas_handler.width,
    ch: canvas_handler.height,
    imgd: image_data,
    ctx: context,
    lib: {cgl:cgl,
          cmx:cmx}
}

// Create objects for each logic script
// internal
//let run = new Run(la.cw, la.ch, la.imgd, la.ctx, la.lib);
// external
let template = new Template(la.cw, la.ch, la.imgd, la.ctx, la.lib);
let scene = new Scene(la.cw, la.ch, la.imgd, la.ctx, la.lib);
let gameLogic = new GameLogic(la.cw, la.ch, la.imgd, la.ctx, la.lib);
let boardUI = new BoardUI(la.cw, la.ch, la.imgd, la.ctx, la.lib);
let fontAnim = new FontAnim(la.cw, la.ch, la.imgd, la.ctx, la.lib);

// ===========================================================
// Drawing Workspace
// ===========================================================
// execute main from each logic scripts
//template.main();
//scene.main();

gameLogic.main(boardUI, fontAnim);
//boardUI.main();

/*
let logic = {
    gameLogic: gameLogic,
    boardUI: boardUI,
    fontAnim: fontAnim
}
*/

//run.run(logic);

// draw changes to canvas
context.putImageData(image_data, 0, 0);