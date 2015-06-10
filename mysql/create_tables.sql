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
   `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
   `updated_at` DATETIME ON UPDATE CURRENT_TIMESTAMP 
)
ENGINE = InnoDB;

CREATE TABLE `organization` (
   `id` INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
   `name` VARCHAR(100) NOT NULL UNIQUE,
   `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
   `updated_at` DATETIME ON UPDATE CURRENT_TIMESTAMP 
) 
ENGINE = InnoDB;

CREATE TABLE `organization_role` (
   `id` INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
   `name` VARCHAR(30) NOT NULL UNIQUE,
   `description` VARCHAR(100),
   `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
   `updated_at` DATETIME ON UPDATE CURRENT_TIMESTAMP 
)
ENGINE = InnoDB;

CREATE TABLE `user_organization_role` (
   `id` INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
   `user_id` INT UNSIGNED NOT NULL, 
   `organization_id` INT UNSIGNED NOT NULL,
   `organization_role_id` INT UNSIGNED NOT NULL,
   `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
   `updated_at` DATETIME ON UPDATE CURRENT_TIMESTAMP,
   FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE CASCADE,
   FOREIGN KEY (organization_id) REFERENCES organization(id) ON DELETE CASCADE,
   FOREIGN KEY (organization_role_id) REFERENCES organization_role(id) ON DELETE CASCADE
) 
ENGINE = InnoDB;

CREATE TABLE `gym` (
   `id` INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
   `organization_id` INT UNSIGNED NOT NULL,
   `name` VARCHAR(100) NOT NULL UNIQUE,
   `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
   `updated_at` DATETIME ON UPDATE CURRENT_TIMESTAMP,
   FOREIGN KEY (organization_id) REFERENCES organization(id) ON DELETE CASCADE
) 
ENGINE = InnoDB;

CREATE TABLE `gym_role` (
   `id` INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
   `name` VARCHAR(30) NOT NULL UNIQUE,
   `description` VARCHAR(100),
   `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
   `updated_at` DATETIME ON UPDATE CURRENT_TIMESTAMP 
) 
ENGINE = InnoDB;

CREATE TABLE `user_gym_role` (
   `id` INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
   `user_id` INT UNSIGNED NOT NULL, 
   `gym_id` INT UNSIGNED NOT NULL,
   `gym_role_id` INT UNSIGNED NOT NULL,
   `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
   `updated_at` DATETIME ON UPDATE CURRENT_TIMESTAMP,
   FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE CASCADE,
   FOREIGN KEY (gym_id) REFERENCES gym(id) ON DELETE CASCADE,
   FOREIGN KEY (gym_role_id) REFERENCES gym_role(id) ON DELETE CASCADE
) 
ENGINE = InnoDB;