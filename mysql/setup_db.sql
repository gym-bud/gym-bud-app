CREATE DATABASE IF NOT EXISTS `gb_test` 
   DEFAULT CHARACTER SET utf8 
   DEFAULT COLLATE utf8_general_ci;

GRANT ALL ON `gb_test`.* 
   TO 'testroot'@'localhost' 
   IDENTIFIED BY 'pass';
