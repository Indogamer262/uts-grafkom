import * as std from "../lib/std.js"

export default class Scene {
    constructor(newWidth, newHeight, image_data, context, lib) {
        this.width = newWidth;
        this.height = newHeight;
        this.image_data = image_data;
        this.context = context;
        this.cgl = lib.cgl;
        this.cmx = lib.cmx;
    }

    main() {
        // kalian ngoding di sini gais, ehehehehe

        // SAMPLE CODE UNTUK GAMBAR KOTAK WARNA HITAM
        /*
        this.cgl.kotak(0,0,30,30,std.color.black);
        this.context.putImageData(this.image_data, 0, 0);
        */

        // SAMPLE CODE UNTUK MENGGUNAKAN BUTTON
        /*
        let triggerButton = document.getElementById("restartBtn");
        triggerButton.addEventListener("click", function() {
            console.log("Ok batman");
        })
        */
    }
}