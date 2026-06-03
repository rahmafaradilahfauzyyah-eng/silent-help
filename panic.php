<?php
include 'koneksi.php';

// ✅ ambil data dengan aman
$lat = isset($_POST['lat']) ? $_POST['lat'] : null;
$lng = isset($_POST['lng']) ? $_POST['lng'] : null;

// ❌ kalau kosong, hentikan
if (!$lat || !$lng) {
    echo "Data lokasi tidak lengkap";
    exit;
}

// ✅ simpan ke database
mysqli_query($conn, "INSERT INTO laporan (lat, lng, status) 
VALUES ('$lat','$lng','panic')");

// optional response
echo "OK";
?>