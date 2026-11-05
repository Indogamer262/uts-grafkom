// 2472008 - Christian Anthony Hermawan

export default class ChelseaGL {
    constructor(newWidth, newHeight, image_data) {
        this.width = newWidth;
        this.height = newHeight;
        this.image_data = image_data;
    }

    // random generator
    randomInt(min, max) {
        return Math.floor(min+(Math.random()*(max-min+1)));
    }

    // draw dot on a image data function
    draw_dot(x, y, color) {
        let index = 4 * (x + y*this.width);
        this.image_data.data[index] = color.r;
        this.image_data.data[index+1] = color.g;
        this.image_data.data[index+2] = color.b;
        this.image_data.data[index+3] = 255;
    }

    lingkaran_naif(xc, yc, radius, color) {
        for (let x=xc-radius; x<=xc+radius; x++) {
            let yp = yc + Math.round(Math.sqrt(radius**2 - (x-xc)**2));
            let ym = yc - Math.round(Math.sqrt(radius**2 - (x-xc)**2));

            let xp = xc + Math.round(Math.sqrt(radius**2 - (x-xc)**2));
            let xm = xc - Math.round(Math.sqrt(radius**2 - (x-xc)**2));

            draw_dot(x, yp, color);
            draw_dot(x, ym, color);

            draw_dot(xp, x, color);
            draw_dot(xm, x, color);
        }
    }

    lingkaran_polar(xc, yc, radius, color) {
        for (let sudut=0; sudut<=Math.PI*2; sudut += 1/radius) {
            let drawX = Math.round(xc + (radius * Math.cos(sudut)));
            let drawY = Math.round(yc + (radius * Math.sin(sudut)));

            this.draw_dot(drawX, drawY, color);

            // console.log(drawX + ", " + drawY);
        }
    }

    circGetDirection(x0, y0, xTar, yTar) {
        let radius = Math.sqrt(Math.abs(xTar-x0)**2 + Math.abs(y0-yTar)**2);

        // X = x0 + r*cos(theta)
        // X - x0 = r*cos(theta)
        // (X - x0)/r = cos(theta)

        // Y = y0 + r*sin(theta)
        // (Y - y0)/r = sin(theta)

        if(yTar <= y0) {
            return Math.asin((xTar - x0)/radius);
        }
        else {
            return Math.acos((xTar - x0)/radius) + (Math.PI*2/360*90);
        }
    }

    dda_line(x1, y1, x2, y2, color) {
        let dx = Math.abs(x2-x1);
        let dy = Math.abs(y2-y1);

        let dirX = x2-x1
        let dirY = y1-y2;
        let m = dirY/dx;
        let mm = dirX/dy
        let regmm = dx/dy

        //console.log("nganu m:  " + m);
        //console.log("nganu mm: " + mm);
        //console.log("nganu regmm: " + regmm);
        //console.log("nganu dx: " + dx);
        //console.log("nganu dy: " + dy);
        //console.log("nganu x2: " + x2)
        //console.log("")

        if (dx >= dy) {
            if(x1 < x2) {
                //let y = y1
                for (let i=0; i<dx; i++) {
                    this.draw_dot(x1+i, y1-Math.round(m*i), color);
                    //y += m;
                    //console.log("iter y: " + m*i)
                }
            }
            else { // x1 >= x2
                //let y = y2
                for (let i=0; i<=dx; i++) {
                    this.draw_dot(x2+i, y2+Math.round(m*i), color);
                    //y += m;
                    //console.log("iter x: " + (x2+i));
                }
            }
        }
        else { //dy < dx -- pokoknya panjangan si y
            if(y1 < y2) { // arahnya ke bawah berarti
                //let x = x1
                for (let i=0; i<dy; i++) {
                    this.draw_dot(x1+Math.round(mm*i), y1+i, color);
                    //x += mm;
                    //console.log("iter y: " + m*i)
                }
            }
            else { // y2 >= y1 // arahnya ke atas cuy
                //let x = x1
                for (let i=0; i<=dy; i++) {
                    this.draw_dot(x1+Math.round(mm*i), y1-i, color);
                    //x += mm;
                    //console.log("iter x: " + (x2+(mm*i)))
                }
            }
        }
    }

    polygon(kump_titik, color) {
        //console.log(kump_titik);
        // menggambar sekumpulan garis sesuai dengan kump_titik
        // loop seumlah panjang kump_titik
        for (let i=0; i<kump_titik.length-1; i++) {
            // bikin garis dari titik ke i ke titik i+1
            this.dda_line(kump_titik[i][0], kump_titik[i][1], kump_titik[i+1][0], kump_titik[i+1][1], color);
        }
        // bikin garis penutup yaitu garis ke length-1 ke 0
        this.dda_line(kump_titik[kump_titik.length-1][0], kump_titik[kump_titik.length-1][1], kump_titik[0][0], kump_titik[0][1], color);
    }

    get_dot(x, y) {
        let color = {r:null, g:null, b:null}
        let index = 4 * (x + y*this.width);
        //console.log(this.image_data.data[index] + " " + this.image_data.data[index+1] + " " + this.image_data.data[index+2]);
        color.r = this.image_data.data[index];
        color.g = this.image_data.data[index+1];
        color.b = this.image_data.data[index+2];
        // color.a = image_data_sy.data[index+3];
        
        return color;
    }

    is_color_same(color1, color2) {
        if(color1.r == color2.r && color1.g == color2.g && color1.b == color2.b) {
            return true;
        }
        else {
            return false;
        }
    }

    floodFillStack(x,y,fill_color) {
        let myQueue = [];
        let proc = null;
        let initColor = this.get_dot(x,y);
        //console.log(this.get_dot(x,y));

        const that = this;
        function isBoundary(x,y) {
            //console.log(x,y);
            //console.log(that.get_dot(x,y));
            if(!that.is_color_same(initColor, that.get_dot(x, y)) || that.is_color_same(fill_color, that.get_dot(x, y))) {
                return true;
            }
            else {
                return false;
            }
        }

        // enqueue first sorrounding
        if (isBoundary(x,y)) {
            return;
        }
        else {
            this.draw_dot(x, y, fill_color);
            if(!isBoundary(x,y+1)) {myQueue.push([x, y+1]); this.draw_dot(x, y+1, fill_color);}
            if(!isBoundary(x,y-1)) {myQueue.push([x, y-1]); this.draw_dot(x, y-1, fill_color);}
            if(!isBoundary(x+1,y)) {myQueue.push([x+1, y]); this.draw_dot(x+1, y, fill_color);}
            if(!isBoundary(x-1,y)) {myQueue.push([x-1, y]); this.draw_dot(x-1, y, fill_color);}
        }
        
        // queue pixel handler
        while (myQueue.length > 0) {
            // get pixel, process, repeat
            proc = myQueue.pop();

            // enqueue more
            if(proc[1]+1 < this.height) if(!isBoundary(proc[0],proc[1]+1)) {myQueue.push([proc[0],proc[1]+1]); this.draw_dot(proc[0], proc[1]+1, fill_color);}
            if(proc[1]-1 >= 0) if(!isBoundary(proc[0],proc[1]-1)) {myQueue.push([proc[0],proc[1]-1]); this.draw_dot(proc[0], proc[1]-1, fill_color);}
            if(proc[0]+1 < this.width) if(!isBoundary(proc[0]+1,proc[1])) {myQueue.push([proc[0]+1,proc[1]]); this.draw_dot(proc[0]+1, proc[1], fill_color);}
            if(proc[0]-1 >= 0) if(!isBoundary(proc[0]-1,proc[1])) {myQueue.push([proc[0]-1,proc[1]]); this.draw_dot(proc[0]-1, proc[1], fill_color);}

            //console.log(myQueue.length);
        }
    }

    boundaryFillStack(x,y,fill_color,boundary_color) {
        let myQueue = [];
        let proc = null;
        let initColor = this.get_dot(x,y);
        //console.log(this.get_dot(x,y));

        const that = this;
        function isBoundary(x,y) {
            if(that.is_color_same(boundary_color, that.get_dot(x, y)) || that.is_color_same(fill_color, that.get_dot(x, y))) {
                return true;
            }
            else {
                return false;
            }
        }

        // enqueue first sorrounding
        if (isBoundary(x,y)) {
            return;
        }
        else {
            this.draw_dot(x, y, fill_color);
            if(!isBoundary(x,y+1)) {myQueue.push([x, y+1]); this.draw_dot(x, y+1, fill_color);}
            if(!isBoundary(x,y-1)) {myQueue.push([x, y-1]); this.draw_dot(x, y-1, fill_color);}
            if(!isBoundary(x+1,y)) {myQueue.push([x+1, y]); this.draw_dot(x+1, y, fill_color);}
            if(!isBoundary(x-1,y)) {myQueue.push([x-1, y]); this.draw_dot(x-1, y, fill_color);}
        }
        
        // queue pixel handler
        while (myQueue.length > 0) {
            // get pixel, process, repeat
            proc = myQueue.pop();

            // enqueue more
            if(proc[1]+1 < this.height) if(!isBoundary(proc[0],proc[1]+1)) {myQueue.push([proc[0],proc[1]+1]); this.draw_dot(proc[0], proc[1]+1, fill_color);}
            if(proc[1]-1 >= 0) if(!isBoundary(proc[0],proc[1]-1)) {myQueue.push([proc[0],proc[1]-1]); this.draw_dot(proc[0], proc[1]-1, fill_color);}
            if(proc[0]+1 < this.width) if(!isBoundary(proc[0]+1,proc[1])) {myQueue.push([proc[0]+1,proc[1]]); this.draw_dot(proc[0]+1, proc[1], fill_color);}
            if(proc[0]-1 >= 0) if(!isBoundary(proc[0]-1,proc[1])) {myQueue.push([proc[0]-1,proc[1]]); this.draw_dot(proc[0]-1, proc[1], fill_color);}

            //console.log(myQueue.length);
        }
    }

    polygon_center(kump_titik) {
        // cari mana tengah polygon dengan pendekatan rumus Luas Berarah dan Koordinat Sentroid
        let sumA = 0;
        let sumX = 0;
        let sumY = 0;

        for (let i = 0; i < kump_titik.length-1; i++) {
            sumA += (kump_titik[i][0] * kump_titik[i+1][1] - kump_titik[i+1][0] * kump_titik[i][1]);
            sumX += (kump_titik[i][0] + kump_titik[i+1][0]) * (kump_titik[i][0] * kump_titik[i+1][1] - kump_titik[i+1][0] * kump_titik[i][1]);
            sumY += (kump_titik[i][1] + kump_titik[i+1][1]) * (kump_titik[i][0] * kump_titik[i+1][1] - kump_titik[i+1][0] * kump_titik[i][1]);
        }
        sumA += (kump_titik[kump_titik.length-1][0] * kump_titik[0][1] - kump_titik[0][0] * kump_titik[kump_titik.length-1][1]);
        sumX += (kump_titik[kump_titik.length-1][0] + kump_titik[0][0]) * (kump_titik[kump_titik.length-1][0] * kump_titik[0][1] - kump_titik[0][0] * kump_titik[kump_titik.length-1][1]);
        sumY += (kump_titik[kump_titik.length-1][1] + kump_titik[0][1]) * (kump_titik[kump_titik.length-1][0] * kump_titik[0][1] - kump_titik[0][0] * kump_titik[kump_titik.length-1][1]);
        
        let valA = 0.5 * sumA;
        let cxyHead = (1/(6*valA))
        let centerX = cxyHead * sumX;
        let centerY = cxyHead * sumY
        //console.log(centerX, centerY);

        return [centerX, centerY];
    }

    polygon_color(kump_titik, color, fillColor) {
        this.polygon(kump_titik, color);
    
        // cari tengah
        let center = this.polygon_center(kump_titik);

        // isi warna polygon dari tengah
        this.floodFillStack(Math.round(center[0]),Math.round(center[1]),fillColor);
    }

    polygon_color_bound(kump_titik, color, fillColor) {
        this.polygon(kump_titik, color);

        // cari tengah
        let center = this.polygon_center(kump_titik);

        // isi warna polygon dari tengah
        this.boundaryFillStack(Math.round(center[0]),Math.round(center[1]),fillColor,color);
    }

    // function to draw a box using draw_dot() function
    kotak(x, y, width, height, color) {
        // nih aku jelasin, initnya mah, ngulang terus dari y atas ke kanan sampe width
        // trus ke bawah, ke kanan lagi, gitu aja terus sampe height
        for(let j=y; j<y+height; j++) {
            for(let i=x; i<x+width; i++) {
                this.draw_dot(i,j, color);
            }
        }
    }

    translate(point, translation) {
        return [
            point[0]+translation[0],
            point[1]+translation[1]
        ];
    }

    translate_multiple(points, translation) {
        let results = [];
        for (let i=0; i<points.length; i++) {
            results[i] = this.translate(points[i], translation);
        }
        return results;
    }

    translate_circle(x,y,deg,dist) {
        let newX = Math.round(x + (dist * Math.cos(Math.PI*2/360*(deg))));
        let newY = Math.round(y + (dist * Math.sin(Math.PI*2/360*(deg))));
        return [newX,newY];
    }

    scale(point, scale) {
        return [
            Math.round(point[0]*scale),
            Math.round(point[1]*scale)
        ];
    }

    scale_multiple_manual(points, scale, anchor) {
        let scaled = [];
        let newPoints = this.translate_multiple(points, [-anchor[0], -anchor[1]]);

        for (let i=0; i<points.length; i++) {
            scaled[i] = this.scale(newPoints[i], scale);
        }

        return this.translate_multiple(scaled, [anchor[0], anchor[1]]);
    }

    scale_multiple_auto(points, scale) {
        return this.scale_multiple_manual(points, scale, points[0]);
    }

    rotate(point, rotationDeg) {
        let deg = Math.PI*2/360*rotationDeg;
        //let deg = rotationDeg;
        return [
            Math.round(point[0] * Math.cos(deg) - point[1] * Math.sin(deg)),
            Math.round(point[1] * Math.cos(deg) + point[0] * Math.sin(deg))
        ];
    }

    rotate_multiple_manual(points, rotationDeg, anchor) {
        let rotated = [];
        let newPoints = this.translate_multiple(points, [-anchor[0], -anchor[1]]);

        for (let i=0; i<points.length; i++) {
            rotated[i] = this.rotate(newPoints[i], rotationDeg);
        }

        return this.translate_multiple(rotated, [anchor[0], anchor[1]]);
    }

    rotate_multiple_auto(points, rotationDeg) {
        return this.rotate_multiple_manual(points, rotationDeg, points[0]);
    }
    
}


// Global Variabel used by the Library
/* 
let width = null;
let height = null;
let context = null;
let glob_image_data = null;

// use importer for variable needs
// this function serve as a global variable setter
export function setVar(newWidth, newHeight, newContext, newGlob_image_data) {
    width = newWidth;
    height = newHeight;
    context = newContext;
    glob_image_data = newGlob_image_data;
}
*/


// Optional function below, enable by converting
/*
export function elips(image_data, xc, yc, xrad, yrad, color) {
    for (let sudut=0; sudut<=Math.PI*2; sudut += (xrad>yrad)?(1/xrad):(1/yrad)) {
        let drawX = Math.round(xc + (xrad * Math.cos(sudut)));
        let drawY = Math.round(yc + (yrad * Math.sin(sudut)));

        draw_dot(image_data, drawX, drawY, color);

        // console.log(drawX + ", " + drawY);
	}
}

export function spiral(image_data, xc, yc, initRad, multiple, color) {
    for (let sudut=0; sudut<=(Math.PI*(2*multiple)); sudut += 1/(initRad*multiple*2*10)) {
        let dynRad = initRad * sudut;
        let drawX = Math.round(xc + (dynRad * Math.cos(sudut)));
        let drawY = Math.round(yc + (dynRad * Math.sin(sudut)));

        draw_dot(image_data, drawX, drawY, color);
        console.log(drawX + ", " + drawY);
	}
}





export function matahari(imageData, xc, yc, radius, rays, r, g, b) {
    // gambar lingkarannya dulu
    lingkaran_polar(imageData, xc, yc, radius, {r:r,g:g,b:b});

    // gambar rays rays
    for (let sudut=0; sudut<=Math.PI*2; sudut += ((Math.PI/rays)*2)) {
        let rayLength = randomInt(20,60);

        let beginX = Math.round(xc + (radius * Math.cos(sudut)));
        let beginY = Math.round(yc + (radius * Math.sin(sudut)));
        let endX = Math.round(xc + ((radius+rayLength) * Math.cos(sudut)));
        let endY = Math.round(yc + ((radius+rayLength) * Math.sin(sudut)));

        dda_line(imageData, beginX, beginY, endX, endY, {r:r,g:g,b:b});
        //kotak(imageData, beginX-2, beginY-2, 5, 5, {r:100,g:0,b:0})
        //kotak(imageData, endX-2, endY-2, 5, 5, {r:0,g:200,b:0})

        // console.log(drawX + ", " + drawY);
	}

}

export function gelombangBunga(imageData, xc, yc, radius, n, amplitude, r,g,b) {
    function degRad(sudut) {
        return radius + amplitude*Math.sin(n*sudut);
    }
    for (let sudut=0; sudut<=Math.PI*2; sudut += 0.001) {
        let drawX = Math.round(xc + (degRad(sudut) * Math.cos(sudut)));
        let drawY = Math.round(yc + (degRad(sudut) * Math.sin(sudut)));

        draw_dot(imageData, drawX, drawY, {r:r,g:g,b:b});

        // console.log(drawX + ", " + drawY);
	}
}







export function boundary_fill(image_data, x, y, boundary_color, fill_color) {
    //console.log("I'm at (" + x + ", " + y + ")")
    if(is_color_same(boundary_color, get_dot(image_data, x, y)) || is_color_same(fill_color, get_dot(image_data, x, y))) {
        return;
    }
    else {
        draw_dot(image_data, x, y, fill_color);
        boundary_fill(image_data, x, y+1, boundary_color, fill_color);
        boundary_fill(image_data, x, y-1, boundary_color, fill_color);
        boundary_fill(image_data, x+1, y, boundary_color, fill_color);
        boundary_fill(image_data, x-1, y, boundary_color, fill_color);
        return;
    }
}

export function boundary_fill_ng(image_data,x,y,boundary_color,fill_color) {
    let myQueue = [];
    let proc = null;

    function isBoundary(x,y) {
        if(is_color_same(boundary_color, get_dot(image_data, x, y)) || is_color_same(fill_color, get_dot(image_data, x, y))) {
            return true;
        }
        else {
            return false;
        }
    }

    // enqueue first sorrounding
    if (isBoundary(x,y)) {
        return;
    }
    else {
        draw_dot(image_data, x, y, fill_color);
        if(!isBoundary(x,y+1)) {myQueue.push([x, y+1]); draw_dot(image_data, x, y+1, fill_color);}
        if(!isBoundary(x,y-1)) {myQueue.push([x, y-1]); draw_dot(image_data, x, y-1, fill_color);}
        if(!isBoundary(x+1,y)) {myQueue.push([x+1, y]); draw_dot(image_data, x+1, y, fill_color);}
        if(!isBoundary(x-1,y)) {myQueue.push([x-1, y]); draw_dot(image_data, x-1, y, fill_color);}
    }
    
    // queue pixel handler
    while (myQueue.length > 0) {
        // get pixel, process, repeat
        proc = myQueue.pop();

        // enqueue more
        if(proc[1]+1 < height) if(!isBoundary(proc[0],proc[1]+1)) {myQueue.push([proc[0],proc[1]+1]); draw_dot(image_data, proc[0], proc[1]+1, fill_color);}
        if(proc[1]-1 >= 0) if(!isBoundary(proc[0],proc[1]-1)) {myQueue.push([proc[0],proc[1]-1]); draw_dot(image_data, proc[0], proc[1]-1, fill_color);}
        if(proc[0]+1 < width) if(!isBoundary(proc[0]+1,proc[1])) {myQueue.push([proc[0]+1,proc[1]]); draw_dot(image_data, proc[0]+1, proc[1], fill_color);}
        if(proc[0]-1 >= 0) if(!isBoundary(proc[0]-1,proc[1])) {myQueue.push([proc[0]-1,proc[1]]); draw_dot(image_data, proc[0]-1, proc[1], fill_color);}

        //console.log(myQueue.length);
    }
}

*/