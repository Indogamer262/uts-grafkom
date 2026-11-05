// Main files for integrating the whole modules

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
// LIBRARY OBJECT DECLARATION
// ===========================================================
let cgl = new ChelseaGL(canvas_handler.width, canvas_handler.height, image_data);
let cmx = new ChelseaMatrix();
cgl.clearCanvas();

// ===========================================================
// Drawing Workspace
// ===========================================================
// POLYGON SHAPE DEFINITION
const kapalBox = [
    [265,375],[335,375],
    [335,400],[265,400]
]
const tiangKapal = [
    [296,375],[304,375],
    [304,300],[296,300]
]
const benderaKapal = [
    [304,300],[304,320],
    [335,310]
]
let kapalBoxDecoy = kapalBox;
let tiangKapalDecoy = tiangKapal;
let benderaKapalDecoy = benderaKapal;

// DRAWING BEGIN HERE


// draw changes to canvas
context.putImageData(image_data, 0, 0);