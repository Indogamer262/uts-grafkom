// 2472029 - Henry Ferdynand Budiana
import * as std from "../lib/std.js"

export default class FontAnim {
    constructor(newWidth, newHeight, image_data, context, lib) {
        this.width = newWidth;
        this.height = newHeight;
        this.image_data = image_data;
        this.context = context;
        this.cgl = lib.cgl;
        this.cmx = lib.cmx;

        // Ukuran dasar karakter lokal
        this.charWidth = 10;
        this.charHeight = 16;
        this.charSpacing = 4;

        // koordinat pasangan titik segmen garis 
        this.charMap = {
            // Angka 0 - 9
            "0": [
                [-5, -8], [5, -8],
                [-5, 8], [5, 8],
                [-5, -8], [-5, 8],
                [5, -8], [5, 8]
            ],
            "1": [
                [0, -8], [-3, -4],
                [0, -8], [0, 8],
                [-4, 8], [4, 8]
            ],
            "2": [
                [-5, -8], [5, -8],
                [5, -8], [5, 0],
                [-5, 0], [5, 0],
                [-5, 0], [-5, 8],
                [-5, 8], [5, 8]
            ],
            "3": [
                [-5, -8], [5, -8],
                [-4, 0], [5, 0],
                [-5, 8], [5, 8],
                [5, -8], [5, 8]
            ],
            "4": [
                [-5, -8], [-5, 0],
                [-5, 0], [5, 0],
                [5, -8], [5, 8]
            ],
            "5": [
                [-5, -8], [5, -8],
                [-5, -8], [-5, 0],
                [-5, 0], [5, 0],
                [5, 0], [5, 8],
                [-5, 8], [5, 8]
            ],
            "6": [
                [-5, -8], [5, -8],
                [-5, -8], [-5, 8],
                [-5, 0], [5, 0],
                [5, 0], [5, 8],
                [-5, 8], [5, 8]
            ],
            "7": [
                [-5, -8], [5, -8],
                [5, -8], [-2, 8]
            ],
            "8": [
                [-5, -8], [5, -8],
                [-5, 0], [5, 0],
                [-5, 8], [5, 8],
                [-5, -8], [-5, 8],
                [5, -8], [5, 8]
            ],
            "9": [
                [-5, -8], [5, -8],
                [-5, 0], [5, 0],
                [-5, 8], [5, 8],
                [-5, -8], [-5, 0],
                [5, -8], [5, 8]
            ],

            // Huruf untuk SCORE, WIN, GAME OVER
            "A": [
                [-5, -8], [5, -8],
                [-5, 0], [5, 0],
                [-5, -8], [-5, 8],
                [5, -8], [5, 8]
            ],
            "C": [
                [-5, -8], [5, -8],
                [-5, -8], [-5, 8],
                [-5, 8], [5, 8]
            ],
            "E": [
                [-5, -8], [5, -8],
                [-5, 0], [3, 0],
                [-5, 8], [5, 8],
                [-5, -8], [-5, 8]
            ],
            "G": [
                [-5, -8], [5, -8],
                [-5, -8], [-5, 8],
                [-5, 8], [5, 8],
                [5, 0], [5, 8],
                [0, 0], [5, 0]
            ],
            "I": [
                [-4, -8], [4, -8],
                [0, -8], [0, 8],
                [-4, 8], [4, 8]
            ],
            "M": [
                [-5, -8], [-5, 8],
                [-5, -8], [0, 0],
                [5, -8], [0, 0],
                [5, -8], [5, 8]
            ],
            "N": [
                [-5, -8], [-5, 8],
                [-5, -8], [5, 8],
                [5, -8], [5, 8]
            ],
            "O": [
                [-5, -8], [5, -8],
                [-5, 8], [5, 8],
                [-5, -8], [-5, 8],
                [5, -8], [5, 8]
            ],
            "R": [
                [-5, -8], [5, -8],
                [-5, 0], [5, 0],
                [-5, -8], [-5, 8],
                [5, -8], [5, 0],
                [0, 0], [5, 8]
            ],
            "S": [
                [-5, -8], [5, -8],
                [-5, -8], [-5, 0],
                [-5, 0], [5, 0],
                [5, 0], [5, 8],
                [-5, 8], [5, 8]
            ],
            "U": [
                [-5, -8], [-5, 8],
                [-5, 8], [5, 8],
                [5, -8], [5, 8]
            ],
            "V": [
                [-5, -8], [0, 8],
                [5, -8], [0, 8]
            ],
            "W": [
                [-5, -8], [-5, 8],
                [0, 0], [-5, 8],
                [0, 0], [5, 8],
                [5, -8], [5, 8]
            ],
            "Y": [
                [-5, -8], [0, 0],
                [5, -8], [0, 0],
                [0, 0], [0, 8]
            ],
            " ": []
        };
    }
    
    // Return daftar titik lokal character
    getCharPoints(char) {
        let key = String(char).toUpperCase();
        let points = this.charMap[key];

        if (!points) {
            return [];
        }

        // Salin koordinat
        let hasil = [];
        for (let i = 0; i < points.length; i++) {
            hasil.push([points[i][0], points[i][1]]);
        }

        return hasil;
    }

    // Draw 1 karakter di posisi pusat (x, y)
    drawChar(char, x, y, scale, color) {
        let points = this.getCharPoints(char);
        if (points.length === 0) {
            return;
        }

        // Transformasi komposit - Translasi
        let matScale = this.cmx.create_scale(scale, scale);
        let matTrans = this.cmx.create_translation(x, y);
        let matTransform = this.cmx.multiply(matTrans, matScale);

        let transformedPoints = this.cmx.execute_transform_points(points, matTransform);

        // Gambar garis dda_line
        for (let i = 0; i < transformedPoints.length; i += 2) {
            let p1 = transformedPoints[i];
            let p2 = transformedPoints[i + 1];
            this.cgl.dda_line(p1[0], p1[1], p2[0], p2[1], color);
        }
    }

    // Menggambar angka
    drawNumberCentered(number, centerX, centerY, color) {
        let str = String(number);
        let digitCount = str.length;

        // Atur skala
        let scale = 2.0;
        if (digitCount === 2) {
            scale = 1.8;
        } else if (digitCount === 3) {
            scale = 1.4;
        } else if (digitCount >= 4) {
            scale = 1.1;
        }

        let scaledWidth = this.charWidth * scale;
        let scaledSpacing = this.charSpacing * scale;
        let stepX = scaledWidth + scaledSpacing;

        // Hitung total lebar teks dan titik pusat X untuk digit pertama
        let totalWidth = digitCount * scaledWidth + (digitCount - 1) * scaledSpacing;
        let startX = centerX - (totalWidth / 2) + (scaledWidth / 2);

        for (let i = 0; i < digitCount; i++) {
            let charX = Math.round(startX + i * stepX);
            this.drawChar(str[i], charX, centerY, scale, color);
        }
    }
}