const planet = document.querySelector(".planet");
const orbitContainer = document.querySelector(".orbit-container");
const orbit = document.querySelector(".orbit");
const text = document.querySelector("h1");
const svg = document.getElementById("dynamic_orbit");
const path = svg.querySelector("path");

// Ambil posisi teks sebagai pusat orbit
const textRect = text.getBoundingClientRect();
const textCenterX = textRect.left + textRect.width / 2;
const textCenterY = textRect.top + textRect.height / 2;

// Tempatkan orbit-container di tengah teks
orbitContainer.style.position = "absolute";
orbitContainer.style.top = `${textCenterY}px`;
orbitContainer.style.left = `${textCenterX}px`;
orbitContainer.style.transform = "translate(-50%, -50%)";

// Ukuran orbit
const radiusX = orbit.offsetWidth / 2;
const radiusY = orbit.offsetHeight / 2;
let angle = 0;

// Array untuk menyimpan titik lintasan (batasi jumlahnya)
let orbitPoints = [];
const maxPoints = 500; // Hindari array terlalu panjang

// Hindari menggambar di 1 detik pertama
let startDrawing = false;
setTimeout(() => {
    startDrawing = true;
}, 1000);

function animateOrbit() {
    let radian = angle * (Math.PI / 180);
    let x = radiusX * Math.cos(radian);
    let y = radiusY * Math.sin(radian);

    // Rotasi 45° agar orbit tetap miring
    let rotatedX = x * Math.cos(Math.PI / 4) - y * Math.sin(Math.PI / 4);
    let rotatedY = x * Math.sin(Math.PI / 4) + y * Math.cos(Math.PI / 4);

    // Menentukan -1 jika di kanan, 1 jika di kiri
    let depthFactor = rotatedX > 0 ? -1 : 1;

    // Warna pelangi mengikuti sudut
    let hue = (angle % 360);
    planet.style.background = `radial-gradient(circle, hsl(${hue}, 100%, 60%) 20%, hsl(${hue}, 100%, 40%) 80%)`;
    planet.style.boxShadow = `0 0 50px hsl(${hue}, 100%, 80%), 0 0 100px hsl(${hue}, 100%, 60%)`;
    planet.style.filter = `drop-shadow(0 0 20px hsl(${hue}, 100%, 70%))`;

    // Terapkan posisi planet
    planet.style.transform = `translate(${rotatedX}px, ${rotatedY}px)`;

    // Ubah z-index planet dan SVG berdasarkan depthFactor
    if (depthFactor === 1) { 
        planet.style.zIndex = "0";  // Planet di depan saat di kiri
        path.style.zIndex = "0"; 
    } else { 
        planet.style.zIndex = "-1"; // Planet di belakang saat di kanan
        path.style.zIndex = "-1"; 
    }

    // Tambahkan titik ke path SVG setelah 1 detik
    if (startDrawing) {
        orbitPoints.push([textCenterX + rotatedX, textCenterY + rotatedY]);

        // Batasi jumlah titik agar tidak membebani browser
        if (orbitPoints.length > maxPoints) {
            orbitPoints.shift();
        }

        // Update path dengan optimalisasi
        path.setAttribute("d", orbitPoints.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p[0]},${p[1]}`).join(" "));
        path.setAttribute("stroke", `hsl(${hue}, 100%, 80%)`);
    }

    angle += 2;
    if (angle >= 360) angle = 0;

    requestAnimationFrame(animateOrbit);
}

animateOrbit();
