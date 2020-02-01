import sqlite3


def checkForUsername(name):
	"""
	This function checks to see if the name the user has entered is already in the mainTable
	"""

	connection = sqlite3.connect("userdata.db")
	cursor = connection.cursor()

	cursor.execute("""SELECT name From main WHERE name = (?)""", (name,))
	names = cursor.fetchall()

	if name.upper() not in str(names).upper():
		return True

	else:
		return False


def addToMain(name, password):
	"""
	Attempts to add the name, password and id of a new user into the 'main' table
	"""
	connection = sqlite3.connect("userdata.db")
	cursor = connection.cursor()
	try:

		if checkForUsername(name):  # returns false if name is already in use
			intId = None

			with open("./static/latestId.txt", "r") as latestId:
				id = latestId.read()  # parses string read from file to integer
				intId = int(id) + 1

			with open("./static/latestId.txt", "w") as latestId:
				latestId.write(str(intId))

			cursor.execute("""INSERT INTO 'main' ('id', 'name', 'password') VALUES (?, ?, ?)""", (id, name, password))

			connection.commit()  # commits new data into table

			return True

		else:
			return False

	except:
		return False

	finally:
		connection.close()


def addToDraw(gameId, word=None, image=None):
	conn = sqlite3.connect("userdata.db")
	cur = conn.cursor()

	cur.execute("""SELECT * FROM drawSomething WHERE gameId = (?)""", (gameId,))

	gameIdExists = cur.fetchone()

	if gameIdExists and image:  # adds image if game is already started
		cur.execute("""UPDATE drawSomething SET 'image' = (?) WHERE gameId=(?)""",
		            (image, gameId))
		conn.commit()
		conn.close()
		return True

	elif not gameIdExists:
		cur.execute("""INSERT INTO drawSomething ('gameId', 'word', 'gameResult', 'guesses') VALUES (?, ?, ?, ?)""",
		            (gameId, word, 0, 4))
		conn.commit()
		conn.close()
		return True

	else:
		conn.close()
		return False


def updateDrawGuess(gameId, guess=None):
	"""
	If guess is provided guesses remaining for the game are set to it.

	if no guess is provided AND a game has already been started guesses remaining is decreased by 2

	if no guess is provided AND a game has NOT been started guess remaining is set to 7

	In all cases the current guesses remaining is returned except False is returned if the gameId doesn't match a game
	"""
	conn = sqlite3.connect("userdata.db")
	cur = conn.cursor()

	cur.execute("""SELECT * FROM drawSomething WHERE gameId=(?)""", (gameId,))

	data = cur.fetchone()

	print(data)

	if data:
		if guess:
			cur.execute("""UPDATE drawSomething SET guesses = (?) WHERE gameId=(?)""", (guess, gameId))
			conn.commit()
			conn.close()
			return guess

		else:
			guessNum = data[3]  # the current game's amount of guesses remaining

			if guessNum:
				if guessNum == 0:
					raise ValueError("This function should not be run if the guesses remaining are 0")

				cur.execute("""UPDATE drawSomething SET guesses = (?) WHERE gameId=(?)""", (guessNum - 1, gameId))
				conn.commit()
				conn.close()
				return guessNum - 1
			else:
				defaultGuessNum = 4
				cur.execute("""UPDATE drawSomething SET guesses = (?) WHERE gameId=(?)""", (defaultGuessNum, gameId))
				conn.commit()
				conn.close()
				return defaultGuessNum

	else:
		return False


def finishDrawGame(gameId):
	conn = sqlite3.connect("userdata.db")
	cur = conn.cursor()

	cur.execute("""SELECT * FROM drawSomething WHERE gameId = (?)""", (gameId,))

	data = cur.fetchone()

	if data:
		cur.execute("""UPDATE drawSomething SET gameResult = 1 WHERE gameId=(?)""", (gameId,))
		conn.commit()
		conn.close()
		return 0

	else:
		return False


def deleteDrawGame(gameId):
	conn = sqlite3.connect("userdata.db")
	cur = conn.cursor()

	cur.execute("""SELECT * FROM drawSomething WHERE gameId = (?)""", (gameId,))
	data = cur.fetchone()

	if data:
		cur.execute("""DELETE FROM drawSomething WHERE gameId = (?)""", (gameId,))
		conn.commit()
		conn.close()
		return True

	else:
		return False


def updateSpaceScore(name, score):
	conn = sqlite3.connect("userdata.db")
	cur = conn.cursor()

	cur.execute("""SELECT * FROM space WHERE name=(?)""", (name,))
	data = cur.fetchone()

	if data[0]:
		cur.execute("""UPDATE space SET score = (?) WHERE name = (?)""", (score, name))

	else:
		cur.execute("""INSERT INTO space ('name', 'score') VALUES (?, ?)""", (name, score))

	conn.commit()
	conn.close()
