# What is needed
If you want to install your own instance of this site for some reason, you will have to provide the following things:
  - An empty sqlite3 database with the correct tables (see below for details)   
  - python >3.6
  - All the required dependencies
  - A login encryption key

```sql
CREATE TABLE main(
    id INT PRIMARY  KEY  NOT NULL,
    name            TEXT NOT NULL,
    password        BLOB NOT NULL,
	postID STRING
)
CREATE TABLE drawSomething(
    gameId BLOB NOT NULL,
    word   TEXT NOT NULL,
    image BLOB,
    guesses INT,
    gameResult INT
)
CREATE TABLE drawSomethingStats(
    name TEXT NOT NULL,
    drawingsMade INT,
    drawingsGuessed INT
)
CREATE TABLE space (
	name STRING NOT NULL,
	score INT NOT NULL,
	level INT DEFAULT 1 NOT NULL
)
```
