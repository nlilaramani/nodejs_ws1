create database api;

use api;

-- drop table users;
create table users (
 id int unsigned not null auto_increment,
name varchar(30) default '',
email varchar(50) default '',
PRIMARY KEY(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

select * from users;