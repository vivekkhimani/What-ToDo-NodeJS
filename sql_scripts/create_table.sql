CREATE TABLE users(
	first_name VARCHAR(30) NOT NULL,
	last_name VARCHAR(30) NOT NULL,
	email VARCHAR(320) NOT NULL,
	password_hash VARCHAR(100) NOT NULL,
	password_uid VARCHAR(100) NOT NULL,
	PRIMARY KEY (email)
	);