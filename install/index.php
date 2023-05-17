<?php 
include("./../api/db.php");

$db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
$db->setAttribute(PDO::ATTR_EMULATE_PREPARES, false);
$create = "CREATE TABLE `$database`.`users` (
    `id` INT(11) NOT NULL AUTO_INCREMENT ,
    `user` VARCHAR(30) NOT NULL ,
    `email` VARCHAR(40) NOT NULL ,
    `pass` VARCHAR(50) NOT NULL ,
    `code` VARCHAR(300) NOT NULL ,
    PRIMARY KEY (`id`)
  ) ENGINE = InnoDB CHARSET=utf8 COLLATE utf8_general_ci;
  
  CREATE TABLE `$database`.`todo_data` (
    `id` INT NOT NULL AUTO_INCREMENT ,
    `userhash` VARCHAR(300) NOT NULL ,
    `data` TEXT NULL DEFAULT NULL ,
    `updates` INT NOT NULL DEFAULT '0' ,
    PRIMARY KEY (`id`)
  ) ENGINE = InnoDB CHARSET=utf8 COLLATE utf8_general_ci;

  CREATE TABLE `$database`.`notes_data` (
    `id` INT NOT NULL AUTO_INCREMENT ,
    `userhash` VARCHAR(300) NOT NULL ,
    `data` TEXT NULL DEFAULT NULL ,
    `updates` INT NOT NULL DEFAULT '0' ,
    PRIMARY KEY (`id`)
  ) ENGINE = InnoDB CHARSET=utf8 COLLATE utf8_general_ci;";

try {
  $db->exec($create);
  echo "Success";
} catch (PDOException $e) {
  echo $e->getMessage();
}

?>