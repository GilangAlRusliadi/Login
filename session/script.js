document.addEventListener("DOMContentLoaded", function() {
    // Cek apakah user sudah login
    if (!sessionStorage.getItem("isLoggedIn") && window.location.pathname !== "/login") {
        window.location.href = "/login";
    }

});

// Fungsi untuk mengecek password (dipanggil dari login.html)
async function checkPassword(event) {
    event.preventDefault(); // Mencegah reload halaman

    const inputPassword = document.getElementById("password").value;
    const correctHash = "fd661be79884b7690c710fce23ae6be0c9db51d6f33cc376eb542744d16b8772"; // Hash SHA-256 yang benar

    // Konversi input password menjadi SHA-256
    const encoder = new TextEncoder();
    const data = encoder.encode(inputPassword);
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

    if (hashHex === correctHash) {
        sessionStorage.setItem("isLoggedIn", "true"); // Simpan status login
        window.location.href = "/"; // Arahkan ke halaman utama
    } else {
        alert("Password salah! Coba lagi.");
    }
}

// Cek apakah user sudah login, jika ya, langsung masuk ke halaman utama
if (sessionStorage.getItem("isLoggedIn")) {
    window.location.href = "/";
}
