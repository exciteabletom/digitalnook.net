-- Queries for initialising an empty DB, separated by newlines
CREATE TABLE main (id INT PRIMARY KEY NOT NULL, name TEXT NOT NULL, password BLOB NOT NULL, postID STRING);
CREATE TABLE drawSomething (gameId BLOB NOT NULL, word TEXT NOT NULL, image BLOB, guesses INT, gameResult INT);
CREATE TABLE drawSomethingStats (name TEXT NOT NULL, drawingsMade INT, drawingsGuessed INT);
CREATE TABLE space (name STRING NOT NULL, score INT NOT NULL, level INT DEFAULT 1 NOT NULL);
