CREATE TABLE `user` (
   `id` INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
   `email` VARCHAR(50) NOT NULL UNIQUE,
   `password` VARCHAR(60) NOT NULL,
   `first_name` VARCHAR(50) NOT NULL,
   `last_name` VARCHAR(50) NOT NULL,
   `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
   `updated_at` DATETIME ON UPDATE CURRENT_TIMESTAMP 
) 
ENGINE = InnoDB; 

CREATE TABLE `system_admin` (
   `user_id` INT UNSIGNED NOT NULL,
   FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE CASCADE,
   `create_date` DATETIME NOT NULL,
   `modify_date` DATETIME NOT NULL
)
ENGINE = InnoDB;

CREATE TABLE `gym_group` (
   `id` INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
   `name` VARCHAR(100) NOT NULL UNIQUE,
   `create_date` DATE NOT NULL,
   `modify_date` DATE NOT NULL
) 
ENGINE = InnoDB;

CREATE TABLE `gym_group_admin` (
   `gym_group_id` INT UNSIGNED NOT NULL,
   `user_id` INT UNSIGNED NOT NULL, 
   `create_date` DATE NOT NULL,
   `modify_date` DATE NOT NULL,
   FOREIGN KEY (gym_group_id) REFERENCES gym_group(id) ON DELETE CASCADE,
   FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE CASCADE
) 
ENGINE = InnoDB;

CREATE TABLE `gym` (
   `id` INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
   `gym_group_id` INT UNSIGNED NOT NULL,
   `name` VARCHAR(100) NOT NULL UNIQUE,
   `create_date` DATE NOT NULL,
   `modify_date` DATE NOT NULL,
   FOREIGN KEY (gym_group_id) REFERENCES gym_group(id) ON DELETE CASCADE
) 
ENGINE = InnoDB;

CREATE TABLE `gym_employee` (
   `gym_id` INT UNSIGNED NOT NULL,
   `user_id` INT UNSIGNED NOT NULL,
   `create_date` DATE NOT NULL,
   `modify_date` DATE NOT NULL,
   FOREIGN KEY (gym_id) REFERENCES gym(id) ON DELETE CASCADE,
   FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE CASCADE
) 
ENGINE = InnoDB;
