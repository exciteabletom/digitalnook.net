import sqlite3

from cryptography.fernet import Fernet

from loginKey import key

cipher = Fernet(key)


def checkFromMain(name, password=False):
	"""
	Returns True if username and password (optional) match table data.

	Otherwise, False
	"""
	conn = sqlite3.connect("userdata.db")
	cur = conn.cursor()

	cur.execute("SELECT * from main WHERE name = (?)", (name,))  # this method prevents SQL injection

	data = cur.fetchone()
	conn.close()

	if data:

		if password:
			tablePassword = data[2]  # select password from tuple: (id, username, password)

			encryptedTablePassword = tablePassword.encode()

			decryptedTablePassword = cipher.decrypt(encryptedTablePassword)

			finalTablePassword = decryptedTablePassword.decode()

			if password == finalTablePassword:
				return True

			else:
				return False

			# TODO: probably better way to do this chain of returns

		else:
			return True

	else:
		return False


def checkFromDraw(gameId):
	conn = sqlite3.connect("userdata.db")
	cur = conn.cursor()

	cur.execute("""SELECT * FROM drawSomething WHERE gameId = (?)""", (gameId,))

	data = cur.fetchone()

	if data:  # if tuple is full
		return data

	else:
		return False


def checkForActiveDrawingGames(name):
	conn = sqlite3.connect("userdata.db")
	cur = conn.cursor()
	cur.execute("""SELECT * FROM drawSomething""")

	data = cur.fetchall()  # list of tuples containing all of the table data

	if data:
		games = {
			"sent": [],
			"received": [],
		}

		for i in data:
			names = i[0].split("_")

			if names[0] == name:
				games.get("sent").append(i[0])

			elif names[1] == name:
				games.get("received").append(i[0])

		conn.close()
		return games

	else:
		conn.close()
		return False


def checkIfDrawingWordCorrect(gameId, word):
	"""
	If guessed word is correct returns True

	If guessed word is not correct returns False
	"""
	conn = sqlite3.connect("userdata.db")
	cur = conn.cursor()

	cur.execute("""SELECT * FROM drawSomething WHERE gameId=(?) AND word=(?)""", (gameId, word.lower()))
	data = cur.fetchone()

	if data:
		cur.execute("""UPDATE drawSomething SET guesses = -100""")
		return True

	else:
		return False
