CREATE TABLE groups (
`id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
group_name varchar(255) ,
kids int(5),
adults int(5),
vehicles int(5), 
last_action datetime,
guid varchar(25) 
)ENGINE=innodb;

