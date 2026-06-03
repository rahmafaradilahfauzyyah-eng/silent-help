<?php
session_start();
if (!isset($_SESSION['admin'])) {
    header("Location: login.html");
    exit;
}
include 'koneksi.php';

$data = mysqli_query($conn, "SELECT * FROM laporan WHERE status='panic' ORDER BY id DESC");
?>

<!DOCTYPE html>
<html lang="id">
<head>
<meta charset="UTF-8">
<title>Dashboard Admin</title>

<style>
body {
    font-family: Arial;
    background: #f4f6f9;
    margin: 0;
}

.header {
    background: #2c3e50;
    color: white;
    padding: 15px;
    text-align: center;
}

.container {
    display: flex;
}

.sidebar {
    width: 30%;
    height: 100vh;
    overflow-y: auto;
    background: #fff;
    border-right: 1px solid #ddd;
}

.card {
    padding: 15px;
    margin: 10px;
    border-radius: 10px;
    background: #fff;
    box-shadow: 0 2px 5px rgba(0,0,0,0.1);
}

.card.panic {
    border-left: 5px solid red;
}

.map {
    width: 70%;
}

iframe {
    width: 100%;
    height: 100vh;
    border: none;
}
</style>
</head>

<body>

<div class="header">
    <h2>🚨 Dashboard Admin Silent Help</h2>
    <a href="logout.php" style="color:white;">Logout</a>
</div>

<div class="container">

    <!-- LIST DATA -->
    <div class="sidebar">
        <?php while($row = mysqli_fetch_assoc($data)) { ?>
            <div class="card panic" onclick="showMap(<?= $row['lat'] ?>, <?= $row['lng'] ?>)">
                <b><?= $row['nama'] ?></b><br>
                <?= $row['deskripsi'] ?><br>
                📍 <?= $row['alamat'] ?><br>
                <small><?= $row['created_at'] ?></small>
            </div>
        <?php } ?>
    </div>

    <!-- MAP -->
    <div class="map">
        <iframe id="mapFrame"
            src="https://www.google.com/maps?q=0,0&output=embed">
        </iframe>
    </div>

</div>

<script>
// 📍 tampilkan map saat card diklik
function showMap(lat, lng) {
    document.getElementById("mapFrame").src =
        `https://www.google.com/maps?q=${lat},${lng}&output=embed`;
}

// 🔔 AUTO REFRESH (real-time sederhana)
setInterval(() => {
    location.reload();
}, 5000); // refresh tiap 5 detik
</script>

</body>
</html>