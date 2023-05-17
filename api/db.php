<?php
$servername = "localhost";
$database = "enote";
$username = "root";
$password = "";

$GLOBALS['securityCodeOne'] = "12345678901234567890";
$GLOBALS['securityCodeTwo'] = "12345678901234567890";
$GLOBALS['securityCodeThree'] = "1234567890";
$GLOBALS['securityCodeFour'] = "1234567890";
$GLOBALS['cryptPass'] = "12345678901234567890";
$GLOBALS['tagPass'] = "1234567890123456"; //! 16 caracters

$enoteVers = "1.50";

try {
    $db = new PDO("mysql:host=$servername;dbname=$database", $username, $password);
    $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
//   echo "Connection failed: " . $e->getMessage();
}
