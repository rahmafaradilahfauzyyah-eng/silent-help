<?php
include 'koneksi.php';

$nama = $_POST['nama'];
$deskripsi = $_POST['deskripsi'];
$alamat = $_POST['alamat'];
$kategori = isset($_POST['kategori']) ? implode(",", $_POST['kategori']) : "";

// simpan ke database
mysqli_query($conn, "INSERT INTO laporan 
(nama, deskripsi, alamat, kategori, status)
VALUES ('$nama','$deskripsi','$alamat','$kategori','normal')");

// redirect
header("Location: konfirmasi.html");
?>