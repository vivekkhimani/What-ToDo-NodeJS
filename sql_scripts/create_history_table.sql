CREATE TABLE history(
	email VARCHAR(320) NOT NULL,
	task VARCHAR(10000) NOT NULL,
	counter INT NOT NULL,
	PRIMARY KEY (email)
);