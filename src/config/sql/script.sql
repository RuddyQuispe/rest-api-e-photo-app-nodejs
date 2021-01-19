/* ******** Create user or Role * **** */
/*
CREATE ROLE ephotoapp
	WITH
	LOGIN
	SUPERUSER
	CREATEDB
	CREATEROLE
	INHERIT
	REPLICATION
	CONNECTION LIMIT -1
	PASSWORD '123456';
*/
/* ********* Create Database ************* */
/*
CREATE DATABASE ephotoapp
	with owner=ephotoapp
	encoding='UTF8'
	tablespace=pg_default
	CONNECTION LIMIT=-1;
*/

create table event_organizer_user(
	id serial primary key,
	name varchar(100) not null,
	phone varchar(8) not null,
	email varchar(30) not null,
	password text not null,
	status boolean not null
);

create table photo_studio(
	id serial primary key,
	name varchar(100) not null,
	address varchar(30) not null
);

create table photographer_user(
	code serial primary key,
	name varchar(100) not null,
	email varchar(30) not null,
	status boolean not null,
	password text not null,
	id_studio integer not null,
	foreign key (id_studio) references photo_studio(id)
	on update cascade
	on delete cascade
);

create table social_network(
	id serial primary key,
	description varchar(10) not null
);

create table studio_social(
	id_social integer not null,
	id_studio integer not null,
	description text not null,
	primary key(id_social,id_studio),
	foreign key (id_social) references social_network(id)
	on update cascade
	on delete cascade,
	foreign key (id_studio) references photo_studio(id)
	on update cascade
	on delete cascade
);

create table photo_social(
	id_social integer not null,
	code_photographer integer not null,
	description text not null,
	primary key(id_social, code_photographer),
	foreign key (id_social) references social_network(id)
	on update cascade
	on delete cascade,
	foreign key (code_photographer) references photographer_user(code)
	on update cascade
	on delete cascade
);

create table event(
	code serial primary key,
	description varchar(50) not null,
	date_event date not null,
	location varchar(25) not null,
	status_request boolean not null,
	id_event_organizer_user integer not null,
	id_photo_studio integer not null,
	foreign key (id_event_organizer_user) references event_organizer_user(id)
	on update cascade
	on delete cascade,
	foreign key (id_photo_studio) references photo_studio(id)
	on update cascade
	on delete cascade
);

create table guest_user(
	id serial primary key,
	name varchar(100) not null,
	email varchar(30) not null,
	phone varchar(8) not null,
	password text not null,
	photo_1 text not null,
	photo_2 text not null,
	photo_3 text not null
);

create table photography(
	id serial primary key,
	name text not null,
	price decimal(10,2) not null,
	code_event integer not null,
	code_photographer integer not null,
	foreign key (code_event) references event(code)
	on update cascade
	on delete cascade,
	foreign key (code_photographer) references photographer_user(code)
	on update cascade
	on delete cascade
);

create table sale_note(
	no_sale serial primary key,
	total_cost decimal(10,2) not null,
	id_guest integer not null,
	foreign key (id_guest) references guest_user(id)
	on update cascade
	on delete cascade
);

create table sale_detail(
	id_photo integer not null,
	no_sale integer not null,
	primary key(id_photo, no_sale),
	foreign key (id_photo) references photography(id)
	on update cascade
	on delete cascade,
	foreign key (no_sale) references sale_note(no_sale)
	on update cascade
	on delete cascade
);

select * from event_organizer_user eou;

insert into event_organizer_user("name",phone,email,"password",status) values 
('ruddy quispe', '65944030', 'ruddyq18@gmail.com', '$2a$10$funLh0alzse4t/Qf01N/4ugZMwwx/heVb2sqMwK88Je6cKkVXH/PG', true),
('ruslan', '75946060', 'ruslan@gmail.com', '$2a$10$funLh0alzse4t/Qf01N/4ugZMwwx/heVb2sqMwK88Je6cKkVXH/PG', false),
('jhonny', '65944332', 'jhonny@gmail.com', '$2a$10$funLh0alzse4t/Qf01N/4ugZMwwx/heVb2sqMwK88Je6cKkVXH/PG', false),
('corey', '65944990', 'corey@gmail.com', '$2a$10$funLh0alzse4t/Qf01N/4ugZMwwx/heVb2sqMwK88Je6cKkVXH/PG', true);

select * from photo_studio ps;

insert into photo_studio("name",address) values 
('kodak', 'Plaza 24 septiembre'),
('photo studio market', 'calle libertad'),
('express photo', 'calle charcas'),
('pictures market', 'mutualista');

select * from photographer_user pu;

insert into photographer_user("name",email,status,"password",id_studio) values
('ruddy bryan', 'ruddyq96@gmail.com', true, '$2a$10$funLh0alzse4t/Qf01N/4ugZMwwx/heVb2sqMwK88Je6cKkVXH/PG', 1),
('roman', 'roman@gmail.com', false, '$2a$10$funLh0alzse4t/Qf01N/4ugZMwwx/heVb2sqMwK88Je6cKkVXH/PG', 1),
('gary', 'gary@gmail.com', true, '$2a$10$funLh0alzse4t/Qf01N/4ugZMwwx/heVb2sqMwK88Je6cKkVXH/PG', 2),
('rosmery chan', 'rossy@gmail.com', false, '$2a$10$funLh0alzse4t/Qf01N/4ugZMwwx/heVb2sqMwK88Je6cKkVXH/PG', 2),
('daniel', 'danny@gmail.com', false, '$2a$10$funLh0alzse4t/Qf01N/4ugZMwwx/heVb2sqMwK88Je6cKkVXH/PG', 3),
('dorian', 'dorian@gmail.com', true, '$2a$10$funLh0alzse4t/Qf01N/4ugZMwwx/heVb2sqMwK88Je6cKkVXH/PG', 4);

select * from social_network sn;

insert into social_network(description) values ('Facebook'),('Twiter'),('Instagram'),('Tik tok');

select * from studio_social ss;

insert into studio_social(id_social,id_studio,description) values
(1, 1, 'https://stackoverflow.com/questions/34045375/connect-over-ssh-using-a-pem-file'),
(2, 1, 'https://stackoverflow.com/questions/34045375/connect-over-ssh-using-a-pem-file'),
(3, 1, 'https://stackoverflow.com/questions/34045375/connect-over-ssh-using-a-pem-file'),
(1, 2, 'https://stackoverflow.com/questions/34045375/connect-over-ssh-using-a-pem-file'),
(2, 2, 'https://stackoverflow.com/questions/34045375/connect-over-ssh-using-a-pem-file'),
(3, 3, 'https://stackoverflow.com/questions/34045375/connect-over-ssh-using-a-pem-file'),
(1, 4, 'https://stackoverflow.com/questions/34045375/connect-over-ssh-using-a-pem-file'),
(3, 4, 'https://stackoverflow.com/questions/34045375/connect-over-ssh-using-a-pem-file');

select * from photo_social ps;

insert into photo_social(id_social,code_photographer,description) values
(1, 1, 'https://stackoverflow.com/questions/34045375/connect-over-ssh-using-a-pem-file'),
(2, 1, 'https://stackoverflow.com/questions/34045375/connect-over-ssh-using-a-pem-file'),
(3, 1, 'https://stackoverflow.com/questions/34045375/connect-over-ssh-using-a-pem-file'),
(3, 2, 'https://stackoverflow.com/questions/34045375/connect-over-ssh-using-a-pem-file'),
(1, 2, 'https://stackoverflow.com/questions/34045375/connect-over-ssh-using-a-pem-file'),
(1, 3, 'https://stackoverflow.com/questions/34045375/connect-over-ssh-using-a-pem-file'),
(3, 3, 'https://stackoverflow.com/questions/34045375/connect-over-ssh-using-a-pem-file'),
(3, 4, 'https://stackoverflow.com/questions/34045375/connect-over-ssh-using-a-pem-file'),
(1, 5, 'https://stackoverflow.com/questions/34045375/connect-over-ssh-using-a-pem-file'),
(2, 6, 'https://stackoverflow.com/questions/34045375/connect-over-ssh-using-a-pem-file');

select * from "event" e;

insert into "event"(description,date_event,"location",status_request,id_event_organizer_user,id_photo_studio) values
('premios balon de oro', '2021-01-01', 'av. la salle', true, 1, 1),
('oscar awards', '2020-12-11', 'coliseo julio borelli', false, 1, 1),
('premios puskas', '2020-01-12', 'estadio tahuichi', true, 1, 2);

select * from guest_user gu;

insert into guest_user("name",email,phone,"password",photo_1,photo_2,photo_3) values
('robert ruidiaz','ruddyq96@gmail.com','65767689','$2a$10$yNeUAtnqOe/7XA2BpwwYGeejpOCoZv5VDdwaEY521Qj/OJxGZ1/AG','76ef91d1-cd52-408c-93d7-04822c5d8869.jpg', 'c760c1b2-73ae-4819-91df-891ac53ad6ab.jpg', '480c4d2e-13d5-4c49-ab51-1443711a1184.jpg');

select * from photography p;

insert into photography("name",price,code_event,code_photographer) values 
('photo3.jpg',10.0,1,1),
('photo4.jpg',10.0,1,2),
('photo5.jpg',15.0,1,1),
('photo6.jpg',10.0,1,2),
('photo7.jpg',10.0,1,2),
('photo8.jpg',10.0,1,1),
('photo9.jpg',10.0,1,2),
('photo11.jpg',10.0,1,1),
('photo12.jpg',10.0,1,1),
('photo13.jpg',10.0,1,1);

insert into photography("name",price,code_event,code_photographer) values 
('fiest3.jpg',10.0,2,3),
('fiest4.jpg',10.0,2,4),
('fiesta1.jpg',15.0,2,3),
('fiesta2.jpg',10.0,2,3),
('fiesta5.jpg',10.0,2,4);