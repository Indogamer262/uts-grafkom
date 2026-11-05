// Main files for integrating the whole modules

// import * as cgl from "./ChrisGL.js";
import ChelseaGL from "./lib/ChrisGL.js";
import ChelseaMatrix from "./lib/ChelseaMatrix.js"
import * as std from "./lib/std.js"

const canvas_handler = document.querySelector("#mycanvas");
const context = canvas_handler.getContext("2d");

// get image data
const image_data = context.getImageData(
    0,0, //get image from this starting x, y
    canvas_handler.width, //width of image
    canvas_handler.height,
);

let cgl = new ChelseaGL(canvas_handler.width, canvas_handler.height, image_data);
let cmx = new ChelseaMatrix();
function clearCanvas() {
    cgl.kotak(0,0,canvas_handler.width,canvas_handler.height,{r:255,g:255,b:255});
}
clearCanvas();
function clearCanvasLocal(x,y,w,h) {
    cgl.kotak(x,y,w,h,{r:255,g:255,b:255});
}

// ===========================================================
// Drawing Workspace
// ===========================================================
// COLOR DEFINITION

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