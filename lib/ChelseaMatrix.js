// 2472008 - Christian Anthony Hermawan

export default class ChelseaMatrix {
    /*
    constructor(newWidth, newHeight, image_data) {
        this.width = newWidth;
        this.height = newHeight;
        this.image_data = image_data;
    }
    */
    constructor() {
        
    }

    multiply(matA, matB) {
        // do matrix multiplication here, then return it
        let hasil =  [
            [0,0,0],
            [0,0,0],
            [0,0,0]
        ];

        for (let i=0;i<3;i++) {
            for (let j=0;j<3;j++) {
                for(let k=0;k<3;k++) {
                    hasil[i][k] += matA[i][j] * matB[j][k];
                }
            }
        }

        return hasil;
    }

    transform_point(point, m) {
        let newX = m[0][0]*point[0] + m[0][1]*point[1] + m[0][2]*1;
        let newY = m[1][0]*point[0] + m[1][1]*point[1] + m[1][2]*1;

        return [Math.round(newX), Math.round(newY)];
    }

    // this method is used to execute the transformation matrix that previously been created
    execute_transform_points(kump_titik, createdTransformationMat) {
        let hasil = [];
        for (var i=0;i<kump_titik.length;i++) {
            let resultPos;
            resultPos = this.transform_point(kump_titik[i],createdTransformationMat);
            hasil.push(resultPos);
        }

        return hasil;
    }

    create_identity() {
        let identitas = [
            [1,0,0],
            [0,1,0],
            [0,0,1]
        ];

        return identitas;
    }

    create_translation(tx, ty) {
        let translasi = [
            [1,0,tx],
            [0,1,ty],
            [0,0,1]
        ];
        return translasi;
    }

    create_scale (sx, sy) {
        let skala = [
            [sx,0,0],
            [0,sy,0],
            [0,0,1]
        ];
        return skala;
    }

    create_rotation(degree) {
        let rotasi = [
            [Math.cos(degree),-Math.sin(degree),0],
            [Math.sin(degree),Math.cos(degree),0],
            [0,0,1]
        ];
        return rotasi;
    }

    create_fixedp_rotation(xc, yc, degree) {
        let matA = this.create_translation(-xc, -yc);
        let matB = this.create_rotation(degree);
        let matC = this.create_translation(xc,yc);

        let hasil;
        hasil = this.multiply(matC,matB);
        hasil = this.multiply(hasil, matA);
        
        return hasil;
    }

    create_fixedp_scale(xc, yc, sx, sy) {
        let matA = this.create_translation(-xc, -yc);
        let matB = this.create_scale(sx,sy);
        let matC = this.create_translation(xc,yc);

        let hasil;
        hasil = this.multiply(matC,matB);
        hasil = this.multiply(hasil, matA);
        
        return hasil;
    }
}