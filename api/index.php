<?php
include "./db.php";

// * version printing
if (!isset($_COOKIE["eVersion"]) || $_COOKIE["eVersion"] != $enoteVers) {
    setcookie("eVersion", $enoteVers, time() + (60 * 60 * 24 * 365), "/");
}

function spaceClear($x)
{
    $x = str_replace("/s+/", "", $x);
    $x = str_replace(" ", "", $x);
    $x = str_replace(" ", "", $x);
    $x = str_replace(" ", "", $x);
    $x = str_replace("/s/g", "", $x);
    $x = str_replace("/s+/g", "", $x);
    $x = trim($x);
    return $x;

    // $x = preg_replace('/\s+/u', '', $x);
    // $x = trim($x);
    // return $x;
}

$methot = $_SERVER["REQUEST_METHOD"];

$formid = (!empty(@$_POST["formid"])) ? @$_POST["formid"] : @$_GET["formid"];
$formid = (!empty($formid)) ? strip_tags(trim(spaceClear($formid))) : null;

//? Signed In
$cockie_username = @$_COOKIE["username"];
$cockie_userhash = @$_COOKIE["userhash"];
$cockie_username = (!empty($cockie_username)) ? strip_tags(trim(spaceClear($cockie_username))) : null;
$cockie_userhash = (!empty($cockie_userhash)) ? strip_tags(trim(spaceClear($cockie_userhash))) : null;

$namehash = md5(md5($securityCodeOne . $cockie_username . $securityCodeTwo));

if (!empty($cockie_username) && !empty($cockie_userhash)) {
    $data = $db->prepare("select pass from users where user=:user");
    $data->execute(
        array(
            'user' => $cockie_username,
        )
    );
    $count = $data->rowCount();
    if ($count == 1) {
        $result = $data->fetch(PDO::FETCH_ASSOC);
        $cockie_userhashCrpto = md5(md5($securityCodeOne . $result["pass"] . $securityCodeTwo));
        if ($cockie_userhash != $cockie_userhashCrpto) {
            // header("location:./login/");
            header('HTTP/1.0 403 Forbidden');
        } else {
            process($db, $methot, $cockie_userhash, $namehash, $formid, $securityCodeOne, $securityCodeTwo, $securityCodeThree, $securityCodeFour, $cryptPass, $tagPass);
        }
    }
} else {
    if ($methot == "POST" && $formid == "login" || $formid == "register" || $formid == "forgetpassword") {
        process($db, $methot, $cockie_userhash, $namehash, $formid, $securityCodeOne, $securityCodeTwo, $securityCodeThree, $securityCodeFour, $cryptPass, $tagPass);
    } else {
        header('HTTP/1.0 403 Forbidden');
    }
}
//*---------------------------------------------------------------------------
//* transactions
function process($db, $methot, $cockie_userhash, $namehash, $formid, $securityCodeOne, $securityCodeTwo, $securityCodeThree, $securityCodeFour, $cryptPass, $tagPass)
{
    //* Encryption Algorithm
    function str_encryptaesgcm($plaintext, $password, $encoding = null)
    {
        if ($plaintext != null && $password != null) {
            $keysalt = openssl_random_pseudo_bytes(16);
            // $keysalt = "1234567890123456";//* 16
            $key = hash_pbkdf2("sha512", $password, $keysalt, 20000, 32, true);
            $iv = openssl_random_pseudo_bytes(openssl_cipher_iv_length("aes-256-gcm"));
            // $iv = "123456789012";//* 12
            // $tagPass = "1234567890123456";
            $encryptedstring = openssl_encrypt($plaintext, "aes-256-gcm", $key, OPENSSL_RAW_DATA, $iv, $tagPass, "", 16);
            return $encoding == "hex" ? bin2hex($keysalt . $iv . $encryptedstring . $tagPass) : ($encoding == "base64" ? base64_encode($keysalt . $iv . $encryptedstring . $tagPass) : $keysalt . $iv . $encryptedstring . $tagPass);
        }
    }
    function str_decryptaesgcm($encryptedstring, $password, $encoding = null)
    {
        if ($encryptedstring != null && $password != null) {
            $encryptedstring = $encoding == "hex" ? hex2bin($encryptedstring) : ($encoding == "base64" ? base64_decode($encryptedstring) : $encryptedstring);
            $keysalt = substr($encryptedstring, 0, 16);
            $key = hash_pbkdf2("sha512", $password, $keysalt, 20000, 32, true);
            $ivlength = openssl_cipher_iv_length("aes-256-gcm");
            $iv = substr($encryptedstring, 16, $ivlength);
            $tagPass = substr($encryptedstring, -16);
            return openssl_decrypt(substr($encryptedstring, 16 + $ivlength, -16), "aes-256-gcm", $key, OPENSSL_RAW_DATA, $iv, $tagPass);
        }
    }
    //*---------------------------------------------------------------------------
    // * get data
    if ($methot == "GET" && $formid == "todo") {
        // * get todo
        try {
            $data = $db->prepare("SELECT data FROM todo_data WHERE userhash=:user ORDER BY id DESC");
            $data->execute([
                'user' => $cockie_userhash,
            ]);
            $data->setFetchMode(PDO::FETCH_ASSOC);
            $result = [];
            foreach ($data as $row) {
                $dec = str_decryptaesgcm($row['data'], $cryptPass . $namehash, "base64");
                array_push($result, $dec);
            }
            echo json_encode($result);
        } catch (PDOException $e) {
            // echo "Error: " . $e->getMessage();
        }
    } elseif ($methot == "GET" && $formid == "note") {
        // * get notes
        try {
            $data = $db->prepare("SELECT data FROM notes_data WHERE userhash=:user ORDER BY id DESC");
            $data->execute([
                'user' => $cockie_userhash,
            ]);
            $data->setFetchMode(PDO::FETCH_ASSOC);
            $result = [];
            foreach ($data as $row) {
                $dec = str_decryptaesgcm($row['data'], $cryptPass . $namehash, "base64");
                array_push($result, $dec);
            }
            echo json_encode($result);
        } catch (PDOException $e) {
            // echo "Error: " . $e->getMessage();
        }
    } elseif ($methot == "POST") {
        if ($formid == "todo") {
            // * data
            $data_arr = $_POST['data'];
            // * process
            $status = @$data_arr["status"];
            // * check
            $status = (!empty($status)) ? strip_tags(trim($status)) : null;
            if (gettype($data_arr) != "array" && !empty($status) && gettype($status) != "string" && ($status != "delete" || $status != "new" || $status != "edit")) {
                echo "fail";
            } else {
                // * action to be taken
                if ($data_arr["status"] == "delete") {
                    $id = intval($data_arr['id']);
                    if (!empty($data_arr["status"]) && gettype($id) != "integer") {
                        echo "fail";
                    } else {
                        try {
                            $data = $db->prepare("DELETE FROM todo_data WHERE userhash=:user AND id=:id");
                            $data->execute([
                                'id' => $id,
                                'user' => $cockie_userhash,
                            ]);
                            echo "success";
                        } catch (PDOException $e) {
                            echo "fail";
                            // die($e->getMessage());
                        }
                    }

                } elseif ($data_arr["status"] == "new") {
                    if (count($data_arr) != 7 && !array_key_exists("checked", $data_arr) && !array_key_exists("color", $data_arr) && !array_key_exists("create", $data_arr) && !array_key_exists("update", $data_arr) && !array_key_exists("date", $data_arr) && !array_key_exists("status", $data_arr) && !array_key_exists("text", $data_arr)) {
                        echo "fail";
                    } else {
                        try {
                            $stmt = $db->prepare("INSERT INTO todo_data (userhash) VALUES (:user)");
                            $stmt->execute([
                                'user' => $cockie_userhash,
                            ]);
                            $LAST_ID = $db->lastInsertId();
                            $data_arr['status'] = "";
                            $data_json = json_encode($data_arr + ['id' => $LAST_ID]);
                            $enc = str_encryptaesgcm($data_json, $cryptPass . $namehash, "base64");
                            try {
                                $data = $db->prepare("UPDATE todo_data SET data=:data WHERE id=:id AND userhash=:user");
                                $data->execute([
                                    'id' => $LAST_ID,
                                    'user' => $cockie_userhash,
                                    'data' => $enc,
                                ]);
                                echo "success";
                            } catch (PDOException $e) {
                                echo "fail";
                                // die($e->getMessage());
                                try {
                                    $data = $db->prepare("DELETE FROM todo_data WHERE userhash= :user AND id= :id");
                                    $data->execute([
                                        'user' => $cockie_userhash,
                                        'id' => $LAST_ID,
                                    ]);
                                } catch (PDOException $e) {
                                    // die($e->getMessage());
                                }
                            }
                        } catch (PDOException $e) {
                            echo "fail";
                            // echo $sql . "<br>" . $e->getMessage();
                        }
                    }
                } elseif ($data_arr["status"] == "edit") {
                    if (count($data_arr) != 8 && !array_key_exists("checked", $data_arr) && !array_key_exists("color", $data_arr) && !array_key_exists("create", $data_arr) && !array_key_exists("update", $data_arr) && !array_key_exists("date", $data_arr) && !array_key_exists("status", $data_arr) && !array_key_exists("text", $data_arr) && !array_key_exists("id", $data_arr)) {
                        echo "fail";
                    } else {
                        $id = intval($data_arr['id']);
                        if (!empty($data_arr["status"]) && gettype($id) != "integer") {
                            echo "fail";
                        } else {
                            $data_arr['status'] = "";
                            $data_json = json_encode($data_arr);
                            $enc = str_encryptaesgcm($data_json, $cryptPass . $namehash, "base64");
                            $time = strtotime($data_arr["update"]);
                            try {
                                $data = $db->prepare("UPDATE todo_data SET data=:data, updates=:update WHERE id=:id AND updates <= :update");
                                $data->execute([
                                    'id' => $data_arr['id'],
                                    'user' => $cockie_userhash,
                                    'data' => $enc,
                                    'update' => $time,
                                ]);
                                echo "success";
                            } catch (PDOException $e) {
                                echo "fail";
                                die($e->getMessage());
                            }
                        }
                    }
                }
            }
        } elseif ($formid == "note") {
            // * data
            $data_arr = $_POST['data'];
            // * process
            $status = @$data_arr["status"];
            // * check
            $status = (!empty($status)) ? strip_tags(trim($status)) : null;
            if (gettype($data_arr) != "array" && !empty($status) && gettype($status) != "string" && ($status != "delete" || $status != "new" || $status != "edit")) {
                echo "fail";
            } else {
                // * action to be taken
                if ($data_arr["status"] == "delete") {
                    $id = intval($data_arr['id']);
                    if (!empty($data_arr["status"]) && gettype($id) != "integer") {
                        echo "fail";
                    } else {
                        try {
                            $data = $db->prepare("DELETE FROM notes_data WHERE userhash=:user AND id=:id");
                            $data->execute([
                                'id' => $data_arr['id'],
                                'user' => $cockie_userhash,
                            ]);
                            echo "success";
                        } catch (PDOException $e) {
                            echo "fail";
                            // die($e->getMessage());
                        }
                    }
                } elseif ($data_arr["status"] == "new") {
                    if (count($data_arr) != 8 && !array_key_exists("checked", $data_arr) && !array_key_exists("color", $data_arr) && !array_key_exists("create", $data_arr) && !array_key_exists("update", $data_arr) && !array_key_exists("date", $data_arr) && !array_key_exists("status", $data_arr) && !array_key_exists("text", $data_arr) && !array_key_exists("textarea", $data_arr)) {
                        echo "fail";
                    } else {
                        try {
                            $stmt = $db->prepare("INSERT INTO notes_data (userhash) VALUES (:user)");
                            $stmt->execute([
                                'user' => $cockie_userhash,
                            ]);
                            $LAST_ID = $db->lastInsertId();
                            $data_arr['status'] = "";
                            $data_json = json_encode($data_arr + ['id' => $LAST_ID]);
                            $enc = str_encryptaesgcm($data_json, $cryptPass . $namehash, "base64");
                            try {
                                $data = $db->prepare("UPDATE notes_data SET data=:data WHERE id=:id AND userhash=:user");
                                $data->execute([
                                    'id' => $LAST_ID,
                                    'user' => $cockie_userhash,
                                    'data' => $enc,
                                ]);
                                echo "success";
                            } catch (PDOException $e) {
                                echo "fail";
                                // die($e->getMessage());
                                try {
                                    $data = $db->prepare("DELETE FROM notes_data WHERE userhash= :user AND id= :id");
                                    $data->execute([
                                        'user' => $cockie_userhash,
                                        'id' => $LAST_ID,
                                    ]);
                                } catch (PDOException $e) {
                                    // die($e->getMessage());
                                }
                            }
                        } catch (PDOException $e) {
                            echo "fail";
                            // echo $sql . "<br>" . $e->getMessage();
                        }
                    }
                } elseif ($data_arr["status"] == "edit") {
                    if (count($data_arr) != 9 && !array_key_exists("checked", $data_arr) && !array_key_exists("color", $data_arr) && !array_key_exists("create", $data_arr) && !array_key_exists("update", $data_arr) && !array_key_exists("date", $data_arr) && !array_key_exists("status", $data_arr) && !array_key_exists("text", $data_arr) && !array_key_exists("textarea", $data_arr) && !array_key_exists("id", $data_arr)) {
                        echo "fail";
                    } else {
                        $id = intval($data_arr['id']);
                        if (!empty($data_arr["status"]) && gettype($id) != "integer") {
                            echo "fail";
                        } else {
                            $data_arr['status'] = "";
                            $data_json = json_encode($data_arr);
                            $enc = str_encryptaesgcm($data_json, $cryptPass . $namehash, "base64");
                            $time = strtotime($data_arr["update"]);
                            try {
                                $data = $db->prepare("UPDATE notes_data SET data=:data, updates=:update WHERE id=:id AND updates <= :update");
                                $data->execute([
                                    'id' => $data_arr['id'],
                                    'user' => $cockie_userhash,
                                    'data' => $enc,
                                    'update' => $time,
                                ]);
                                echo "success";
                            } catch (PDOException $e) {
                                echo "fail";
                                die($e->getMessage());
                            }
                        }
                    }
                }
            }
        } elseif ($formid == "login") {
            // * login
            $txtKadi = @$_POST["txtKadi"];
            $txtParola = @$_POST["txtParola"];
            $txtKadi = (!empty($txtKadi)) ? strip_tags(trim(spaceClear(strtolower($txtKadi)))) : null;
            $txtParola = (!empty($txtParola)) ? strip_tags(trim(spaceClear($txtParola))) : null;
            if (empty($txtKadi) || empty($txtParola)) {
                header("location:./../login/?result=error&data=0&txtKadi=$txtKadi");
            } else {
                $txtPassCrpto = md5(md5($securityCodeThree . $txtParola . $securityCodeFour));
                $data = $db->prepare("select pass from users where user=:user");
                $data->execute(
                    array(
                        'user' => $txtKadi,
                    )
                );
                $count = $data->rowCount();
                if ($count == 1) {
                    $result = $data->fetch(PDO::FETCH_ASSOC);
                    if ($txtPassCrpto == $result["pass"]) {
                        $userhash = md5(md5($securityCodeOne . $txtPassCrpto . $securityCodeTwo));
                        if (!empty(@$_POST["ckbHatirla"])) {
                            setcookie("username", $txtKadi, time() + (60 * 60 * 24 * 30), "/");
                            setcookie("userhash", $userhash, time() + (60 * 60 * 24 * 30), "/");
                        } else {
                            setcookie("username", $txtKadi, time() + 3600, "/");
                            setcookie("userhash", $userhash, time() + 3600, "/");
                        }
                        header("location:./../");
                    } else {
                        header("location:./../login/?result=error&data=1&txtKadi=$txtKadi");
                    }
                } else {
                    header("location:./../login/?result=error&data=2&txtKadi=$txtKadi");
                }
            }
        } elseif ($formid == "register") {
            // * register
            $txtKadi = @$_POST["txtKadi"];
            $txtMail = @$_POST["txtMail"];
            $txtParola = @$_POST["txtParola"];
            $txtKod = @$_POST["txtKod"];
            $txtKadi = (!empty($txtKadi)) ? strip_tags(trim(spaceClear(strtolower($txtKadi)))) : null;
            $txtMail = (!empty($txtMail)) ? strip_tags(trim(spaceClear(strtolower($txtMail)))) : null;
            $txtParola = (!empty($txtParola)) ? strip_tags(trim(spaceClear($txtParola))) : null;
            $txtKod = (!empty($txtKod)) ? strip_tags(trim(spaceClear($txtKod))) : null;
            //* empty or full check
            if (empty($txtKadi) || empty($txtMail) || empty($txtParola) || empty($txtKod)) {
                // * err
                header("location:./../login/register/?result=error&data=0&txtKadi=$txtKadi&txtMail=$txtMail");
            } else {
                //* Is there a user
                $data = $db->prepare("select user from users where user=:user or email=:email");
                $data->execute(
                    array(
                        'user' => $txtKadi,
                        'email' => $txtMail,
                    )
                );
                $count = $data->rowCount();
                if ($count == 0) {
                    // * ok
                    $txtPassCrpto = md5(md5($securityCodeThree . $txtParola . $securityCodeFour));
                    $txtKod = md5(md5($securityCodeThree . $txtKod . $securityCodeFour));
                    try {
                        $data = $db->prepare("INSERT INTO users (user, email, pass, code) VALUES (:user, :email, :pass, :code)");
                        $data->execute([
                            'user' => $txtKadi,
                            'email' => $txtMail,
                            'pass' => $txtPassCrpto,
                            'code' => $txtKod,
                        ]);
                        header("location:./../login/");
                    } catch (PDOException $e) {
                        // echo $sql . "<br>" . $e->getMessage();
                    }
                    $db = null;
                } else {
                    // * err
                    header("location:./../login/register/?result=error&data=1&txtKadi=$txtKadi&txtMail=$txtMail");
                }
            }
        } elseif ($formid == "forgetpassword") {
            // * reset password
            $txtKadi = @$_POST["txtKadi"];
            $txtMail = @$_POST["txtMail"];
            $txtParola = @$_POST["txtParola"];
            $txtKod = @$_POST["txtKod"];
            // * check
            $txtKadi = (!empty($txtKadi)) ? strip_tags(trim(spaceClear(strtolower($txtKadi)))) : null;
            $txtMail = (!empty($txtMail)) ? strip_tags(trim(spaceClear(strtolower($txtMail)))) : null;
            $txtParola = (!empty($txtParola)) ? strip_tags(trim(spaceClear($txtParola))) : null;
            $txtKod = (!empty($txtKod)) ? strip_tags(trim(spaceClear($txtKod))) : null;
            if (empty($txtKadi) || empty($txtMail) || empty($txtParola) || empty($txtKod)) {
                // * err
                header("location:./../login/forgetpassword/?result=error&data=0&txtKadi=$txtKadi&txtMail=$txtMail");
            } else {
                // * ok
                $txtPassCrpto = md5(md5($securityCodeThree . $txtParola . $securityCodeFour));
                $txtKod = md5(md5($securityCodeThree . $txtKod . $securityCodeFour));
                try {
                    $data = $db->prepare("UPDATE users SET pass=:pass WHERE user=:user AND email=:email AND code=:code");
                    $data->execute([
                        'user' => $txtKadi,
                        'email' => $txtMail,
                        'pass' => $txtPassCrpto,
                        'code' => $txtKod,
                    ]);
                    echo "success";
                    if ($data->rowCount() > 0) {
                        header("location:./../login/");
                    } else {
                        header("location:./../login/forgetpassword/?result=error&data=1&txtKadi=$txtKadi&txtMail=$txtMail");
                    }
                } catch (PDOException $e) {
                    echo "fail";
                    // die($e->getMessage());
                }
            }
        }

        $db = null;
    }
}
