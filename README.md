# UTS Grafika Komputer
Gameboy 2048, support HP dan Pingsi

# Anggota Tim
* 2472007 - Richard Vincentius Christian Dinata
* 2472008 - Christian Anthony Hermawan
* 2472018 - Kevin Kornelius Martadinata
* 2472029 - Henry Ferdynand Budiana

# Kerangka Kerja
`SimpleFramework` by 2472008, berisi ruang kerja sederhana untuk kolaborasi tim, dengan pohon sebagai berikut:
```
uts-grafkom/
├── assets/
│   └── panah_hideung.png
├── lib/
│   ├── ChelseaMatrix.js
│   ├── ChrisGL.js
│   └── std.js
├── logic/
│   ├── Scene.js
│   └── template.js
├── index.html
├── main.js
└── README.md
```

Keterangan Kerangka Kerja:
* folder `assets/` digunakan untuk menyimpan file assets static, boleh dikategorikan lagi menggunakan trik *folder dalam folder*
* folder `lib/` digunakan untuk menyimpan semua *library*/pustaka yang digunakan, baik itu pustaka bawaan SimpleFramework By 2472008 seperti `ChelseaGL`, `ChelseaMatrix` dan `std` maupun library tambahan seperti `OpenCV`
* folder `logic/` digunakan untuk menyimpan seluruh logika game, termasuk data array (model), perenderan grafis (view), dan juga eksekusi-eksekusinya (controller)

> [!info] Keterangan skema framework
> Untuk kesederhaan aplikasi, SimpleFramework by 2472008 tidak menggunakan arsitektur MVC yang standar karena untuk UTS saat ini, tidak memiliki basis data
