CREATE TABLE tickets (
`id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
guid varchar(25) ,
ticket_type varchar(255) ,
first_name varchar(255) ,
last_name varchar(255) ,
email varchar(255) ,
mobile varchar(255) ,
vehicle_reg varchar(255) ,
vehicle_pass varchar(255) ,
last_action datetime
)ENGINE=innodb;

