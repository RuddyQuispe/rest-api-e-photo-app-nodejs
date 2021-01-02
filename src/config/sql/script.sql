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
	code_photigrapher integer not null,
	primary key(id_social, code_photigrapher),
	foreign key (id_social) references social_network(id)
	on update cascade
	on delete cascade,
	foreign key (code_photigrapher) references photographer_user(code)
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

create or replace function register_user_photographer(name_i varchar(100), email_i varchar(30), password_i text, id_studio_i integer)returns integer as
$BODY$
declare code_user integer;
begin
	insert into photographer_user("name", email, status, "password", id_studio) values (name_i, email_i, true, password_i , id_studio_i) returning code into code_user;
	return code_user;
end $BODY$ language plpgsql;