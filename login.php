<?php
session_start();
$conn = new mysqli("localhost", "root", "", "sembako");

$username = $_POST['username'];
$password = $_POST['password'];

$query = $conn->query("SELECT * FROM admin 
    WHERE username='$username' AND password='$password'");

if ($query->num_rows > 0) {
    $_SESSION['admin'] = $username;
    header("Location: admin.php");
} else {
    echo "Login gagal!";
}
?>