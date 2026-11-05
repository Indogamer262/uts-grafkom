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
import Template from "./logic/template.js"

// ===========================================================
// OBJECT DECLARATION
// ===========================================================
// Libraries Object
let cgl = new ChelseaGL(canvas_handler.width, canvas_handler.height, image_data);
let cmx = new ChelseaMatrix();
cgl.clearCanvas();

// Libraries Compact Var
const lib = {
    cgl:cgl,
    cmx:cmx
}

let template = new Template(canvas_handler.width, canvas_handler.height, image_data, context, lib);

// ===========================================================
// Drawing Workspace
// ===========================================================
template.main();

// draw changes to canvas
context.putImageData(image_data, 0, 0);