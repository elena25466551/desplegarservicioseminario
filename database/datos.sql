CREATE DATABASE IF NOT EXISTS prueba;
USE prueba;
CREATE TABLE IF NOT EXISTS alumnos (id INT AUTO_INCREMENT PRIMARY KEY,apellidos VARCHAR(200),nombres VARCHAR(200),dni INT(11));
INSERT INTO alumnos (apellidos, nombres, dni) VALUES ('Luffy', 'Monkey D.', 123456789),('Ronoroa', 'Zoro', 123456789),('Dorobō Neko', 'Nami', 123123213),('God', 'Usopp', 456456456),('Vinsmoke', 'Sanji', 456456464),('Chopper', 'Tony Tony', 456456789),('Robin', 'Nico', 12332131),('Cyborg', 'Franky', 123789798),('Soul King', 'Brook', 00000000);