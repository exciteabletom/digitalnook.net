import sqlite3


def checkForName(name):
	"""
	This function checks to see if the name the user has entered is already in the database3
	"""

	connection = sqlite3.connect("userdata.db")
	cursor = connection.cursor()

	cursor.execute("""SELECT name From main WHERE name = (?)""", (name,))
	names = cursor.fetchall()

	print(names)

	try:
		if name.upper() not in str(names).upper():
			print("name not in names")
			return True

		else:
			print("name is in names")
			return False

	except Exception as e:
		raise Exception("SQLERROR: " + str(e))


def addToMain(name, password):
	"""
	Attempts to add the name, password and id of a new user into the 'main' Database
	"""
	connection = sqlite3.connect("userdata.db")
	cursor = connection.cursor()
	try:

		if checkForName(name):  # returns false if name is already in use
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

	except ValueError as e:
		raise ValueError("This username is already in use " + str(e))

	finally:
		connection.close()


def addToDraw(gameId, word=None, image=None):
	conn = sqlite3.connect("userdata.db")
	cur = conn.cursor()

	cur.execute("""SELECT * FROM drawSomething WHERE gameId = (?)""", (gameId,))

	gameIdExists = cur.fetchall()

	if gameIdExists and image:  # adds image if game is already started
		cur.execute("""UPDATE drawSomething SET 'image' = (?) WHERE gameId=(?)""",
		            (image,
		             gameId))  # TODO: does sqlite3.binary work properly for jpeg images? mabs store on server in a folder
		conn.commit()

	elif not gameIdExists:
		cur.execute("""INSERT INTO drawSomething ('gameId', 'word') VALUES (?, ?)""", (gameId, word))
		conn.commit()

	else:
		return False

	conn.close()
