########################################################################
# checkTable.py - Copyright 2020, Thomas Chris Dougiamas
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
Functions for getting information from SQL tables.
"""
import sqlite3

from cryptography.fernet import Fernet

from loginKey import key

cipher = Fernet(key)


def getFromMain(name):
	conn = sqlite3.connect("userdata.db")
	cur = conn.cursor()

	cur.execute("""SELECT * FROM main WHERE name = (?)""", (name,))
	data = cur.fetchone()

	return data


def checkIfUsernameAvailable(name):
	"""
	This function checks to see if the name the user has entered is already in the mainTable
	"""

	conn = sqlite3.connect("userdata.db")
	cur = conn.cursor()

	cur.execute("""SELECT * From main WHERE name = (?)""", (name,))
	data = cur.fetchone()

	if data:
		# Username not available
		return False
	else:
		# Username is available
		return True


def checkIfLoginCorrect(name, password=None):
	"""
	Returns True if username and password (optional) match table data.

	Otherwise, False
	"""
	conn = sqlite3.connect("userdata.db")
	cur = conn.cursor()
	cur.execute("SELECT * from main WHERE name = (?)", (name,))

	data = cur.fetchone()
	conn.close()

	if data:

		if password is not None:
			tablePassword = data[2]  # select password from tuple: (id, username, password)

			encryptedTablePassword = tablePassword.encode()

			decryptedTablePassword = cipher.decrypt(encryptedTablePassword)

			finalTablePassword = decryptedTablePassword.decode()

			if password != finalTablePassword:
				return False

		return True

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


def checkFromSpace(name):
	conn = sqlite3.connect("userdata.db")
	cur = conn.cursor()

	cur.execute("""SELECT * FROM space WHERE name = (?)""", (name,))
	data = cur.fetchone()

	return data
