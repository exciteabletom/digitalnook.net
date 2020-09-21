########################################################################
# modifyTable.py - Copyright 2020, Thomas Chris Dougiamas
#
# This file is part of Digital Nook.
#
# Digital Nook is free software: you can redistribute it and/or modify
# it under the terms of the GNU General Public License as published by
# the Free Software Foundation, either version 3 of the License, or
# (at your option) any later version.
#
# Digital Nook is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
# GNU General Public License for more details.
#
# You should have received a copy of the GNU General Public License
# along with Digital Nook.  If not, see <https://www.gnu.org/licenses/>.
########################################################################
"""
This module is for functions that modify SQL tables.
"""
import sqlite3
import checkTable


def addToMain(name, password):
	"""
	Attempts to add the name, password and id of a new user into the 'main' table
	"""
	connection = sqlite3.connect("userdata.db")
	cursor = connection.cursor()
	try:

		if checkTable.checkIfUsernameAvailable(name):  # returns false if name is already in use
			intId = None

			with open("./static/latestId.txt", "r") as latestId:
				id = latestId.read()  # parses string read from file to integer
				intId = int(id) + 1

			with open("./static/latestId.txt", "w") as latestId:
				latestId.write(str(intId))

			cursor.execute("""INSERT INTO 'main' ('id', 'name', 'password') VALUES (?, ?, ?)""", (id, name, password))

			return True

		else:
			return False

	finally:
		connection.commit()
		connection.close()


def addPostID(name):
	from time import time
	from cyrpto import encryptString
	conn = sqlite3.connect("userdata.db")
	cur = conn.cursor()

	cur.execute("""SELECT * FROM main WHERE name=(?)""", (name,))
	data = cur.fetchone()

	if data:
		postID = encryptString(str(time()))
		postID = postID.replace("=", "")  # The equals here screws up my cookie parsing
		cur.execute("""UPDATE main SET 'postID' = (?) WHERE name=(?)""", (postID, name))

		conn.commit()
		conn.close()

		return postID

	raise TypeError("Name (" + name + ") is not in the database")


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


def updateSpaceScore(name, score=None, level=None):
	conn = sqlite3.connect("userdata.db")
	cur = conn.cursor()

	cur.execute("""SELECT * FROM space WHERE name=(?)""", (name,))
	data = cur.fetchone()

	if score != None:
		if data:
			cur.execute("""UPDATE space SET score = (?) WHERE name = (?)""", (score, name))

		else:
			cur.execute("""INSERT INTO space ('name', 'score') VALUES (?, ?)""", (name, score))

	if level != None:
		if data:
			cur.execute("""UPDATE space SET level = (?) WHERE name = (?)""", (level, name))

		else:
			cur.execute("""INSERT INTO space ('name', 'level') VALUES (?, ?)""", (name, level))

	conn.commit()
	conn.close()
