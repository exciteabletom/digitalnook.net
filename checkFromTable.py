import sqlite3

from cryptography.fernet import Fernet

from loginKey import key

cipher = Fernet(key)


def checkFromMain(name, password=False):
	"""
	Returns True if username and password (optional) match table data.

	Otherwise, False
	"""
	connection = sqlite3.connect("userdata.db")
	cursor = connection.cursor()

	cursor.execute("SELECT * from main WHERE name = (?)", (name,))  # this method prevents SQL injection

	rawData = cursor.fetchall()
	print(rawData)

	if rawData:
		data = rawData[0]  # sqlite returns a list of tuples. I only have one tuple I need to isolate it

		if password:
			tablePassword = data[2]  # select password from tuple: (id, username, password)

			tableEncodedPassword = str.encode(tablePassword)  # convert the byte string to a string literal
			decryptedTablePassword = cipher.decrypt(tableEncodedPassword)

			finalTablePassword = decryptedTablePassword.decode()

			if password == finalTablePassword:
				return True

			else:
				return False  # TODO: probably better way to do this chain of returns

		else:
			return True

	else:
		return False


def checkFromDraw(gameId):
	conn = sqlite3.connect("userdata.db")
	cur = conn.cursor()

	cur.execute("""SELECT * FROM drawSomething WHERE gameId = (?)""", (gameId,))

	rawData = cur.fetchall()

	if rawData:  # if tuple is full
		data = rawData[0]  # isolate first tuple from array
		return data

	else:
		return False


def checkForActiveDrawingGames(name):
	conn = sqlite3.connect("userdata.db")
	cur = conn.cursor()
	cur.execute("""SELECT * FROM drawSomething;""")
	data = cur.fetchall()

	if data:
		print(data)
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
