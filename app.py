import json
import operator
from functools import wraps
from string import Template

from flask import Flask, render_template, request, redirect, send_from_directory
from flask_talisman import Talisman

import modifyTable
import checkTable
from cyrpto import encryptString, decryptString
from loginKey import key
from nocache import nocache

app = Flask(__name__)
# SECURITY HEADERS
# for PRODUCTION SERVER ONLY
Talisman(app, content_security_policy=None)

#  encryption functions in jinja2 templating
app.jinja_env.globals.update(decryptString=decryptString)
app.jinja_env.globals.update(encryptString=encryptString)


def loginRequired(appRoute):
	"""
	Simple wrapper that checks to see if the user is logged in or not.

	Works by checking cookies to see if they already exist.
	If cookies already exist and are correct. don't interrupt request.
	If there is no cookies, redirect to login page
	This will be used for the new draw something game that will require a login.
	Reaction game will also be ported over to use this system
	"""

	@wraps(appRoute)
	def wrapper(*args, **kwargs):
		loginErrorMessage = Template("$page requires you to be logged in")
		errorResp = app.make_response(redirect("/login/"))
		pathList = str(request.path).split("/")
		newPathList = [i for i in pathList if i != ""]
		currentPage = newPathList[-1]

		errorResp.set_cookie("LOGINERROR", loginErrorMessage.substitute(page=currentPage.title()))

		if "USERNAME" in request.cookies and "PASSWORD" in request.cookies:
			encryptedUsername = request.cookies.get("USERNAME")
			encryptedPassword = request.cookies.get("PASSWORD")

			username = decryptString(encryptedUsername)
			password = decryptString(encryptedPassword)

 			# true if login cookies are valid credentials
			isValidLogin = checkTable.checkIfLoginCorrect(username, password) 

			if isValidLogin:
				return appRoute(*args, **kwargs)
			else:
				return errorResp
		else:
			return errorResp

	return wrapper


@app.route('/robots.txt')
@app.route('/sitemap.xml')
def staticFromRoot():
	return send_from_directory("", request.path[1:])


# stops caching of leaderboard
@app.route("/static/reactionLeaderboard.json")
@nocache
def staticLeaderboard():
	return app.send_static_file("reactionLeaderboard.json")


# Default page
@app.route("/")
def index():
	if request.cookies.get("USERNAME"):
		currentUser = decryptString(request.cookies.get("USERNAME"))
		return render_template("index.html", currentUser=currentUser)

	else:
		return render_template("index.html")


# About page
@app.route("/about/")
def about():
	return render_template("about.html")


# logout page
@nocache
@app.route("/logout/")
def logout():
	resp = app.make_response(render_template("logout.html"))

	# replaces cookies with empty strings that expire instantly
	resp.set_cookie("USERNAME", "", expires=0)
	resp.set_cookie("PASSWORD", "", expires=0)

	return resp


# login page
@nocache
@app.route("/login/", methods=["GET", "POST"])
def login():
	if request.method == "GET":
		if request.cookies.get("LOGINERROR"):
			loginErrorCookie = request.cookies.get("LOGINERROR")

			resp = app.make_response(render_template("login.html", error=loginErrorCookie))

			resp.set_cookie("LOGINERROR", "", expires=0)
			return resp

		return render_template("login.html")

	elif request.method == "POST":
		username = str(request.form.get("username"))
		password = str(request.form.get("password"))

		if request.cookies.get("USERNAME"):
			return render_template("login.html", error="You are already logged in, would you like to logout?")

		if checkTable.checkIfLoginCorrect(username, password):  # returns true if login is valid
			resp = app.make_response(redirect("/"))

			resp.set_cookie("USERNAME", encryptString(username))
			resp.set_cookie("PASSWORD", encryptString(password))

			return resp

		else:
			return render_template("login.html", error="""Your username or password was incorrect""")


# Registration page
@nocache
@app.route("/register/", methods=["GET", "POST"])
def register():
	if request.method == "GET":
		return render_template("register.html")

	elif request.method == "POST":

		username = request.form.get("username")
		password = request.form.get("password")

		if type(username) is None or type(password) is None:
			return render_template("register.html", error="Please fill in all fields")

		testForIllegalChars = username + password

		if "_" in testForIllegalChars or " " in testForIllegalChars:
			return render_template("register.html", error="Underscores and spaces are not allowed")

		if not checkTable.checkIfUsernameAvailable(username):  # if username is already in use
			return render_template("register.html", error="This username is already in use")

		if len(password) < 8:
			return render_template("register.html", error="Your password must be at least 8 characters long")

		# encrypt password before it is committed to the table
		encryptedPassword = encryptString(password)

		successfulRegister = modifyTable.addToMain(username, encryptedPassword)
		if successfulRegister:
			newUsername = encryptString(username)

			resp = app.make_response(redirect("/"))
			resp.set_cookie("USERNAME", newUsername)
			resp.set_cookie("PASSWORD", encryptedPassword)

			return resp

		else:
			return render_template("register.html", error="An unknown error occurred")


# DrawSomething game
@app.route("/games/drawsomething/", methods=["GET", "POST"])
@loginRequired
def drawSomething():
	"""
	Interprets user actions to render different templates, allows the game to work with different templates on one URL
	BTW, this is messy as hell, my newer code is better
	"""
	if request.method == "GET":
		return render_template("drawSomething/drawSomething.html")

	elif request.method == "POST":

		currentUser = decryptString(request.cookies.get("USERNAME"))  # gets current user from cookies

		# Interprets user actions in the drawsomething forms
		if request.form.get("ACTIONnewGame"):  # newGame.html
			return render_template("drawSomething/newGame.html", currentUser=currentUser)

		elif request.form.get("ACTIONcontinueGame"):  # continueGame.html

			activeGames = checkTable.checkForActiveDrawingGames(currentUser)
			received = ""
			sent = ""

			if activeGames:

				rawReceived = activeGames.get("received")
				received = []
				for i in rawReceived:
					data = checkTable.checkFromDraw(i)

					if data[4] == 1 or data[3] == 0:  # if word was guessed or out of guesses
						continue

					received.append(i)

				rawSent = activeGames.get("sent")
				sent = []
				for i in rawSent:
					newLst = [i]
					data = checkTable.checkFromDraw(i)
					word = data[1]
					guess = data[3]
					gameResult = data[4]

					newLst.append(word)
					if gameResult == 1:
						newLst.append("successfully guessed your drawing")

					elif guess == 1:
						newLst.append("has 1 guess remaining")

					elif guess > 0:
						newLst.append("has " + str(guess) + " guesses remaining")

					elif guess == 0:
						newLst.append("failed to guess the word")

					# newLst == [gameId, word, message about gameState]
					sent.append(newLst)

			return render_template("drawSomething/continueGame.html", currentUser=currentUser, sent=sent,
			                       received=received)

		elif request.form.get("ACTIONrequestForGuessingDrawing"):  # guessDrawing.html
			gameId = request.form.get("gameId")
			userNames = gameId.split("_")  # gameId is sendingPlayer_receivingPlayer
			data = checkTable.checkFromDraw(gameId)

			if not data[3]:
				modifyTable.updateDrawGuess(gameId, 4)
			if data and (userNames[1] == currentUser):
				return render_template("drawSomething/guessDrawing.html", currentUser=currentUser, gameId=gameId,
				                       otherUser=userNames[0], image=data[2], word=data[1], guess=data[3])

		elif request.form.get("ACTIONrequestForViewingGame"):  # viewGame.html
			gameId = request.form.get("gameId")
			userNames = gameId.split("_")
			data = checkTable.checkFromDraw(gameId)

			deletion = False
			if data[3] == 0 or data[4] == 1:
				deletion = True

			if data and (userNames[0] == currentUser):
				return render_template("drawSomething/viewGame.html", currentUser=currentUser, gameId=gameId,
				                       otherUser=userNames[1], image=data[2], word=data[1], guess=data[3],
				                       deletion=deletion,
				                       gameResult=bool(data[4]))

		elif request.form.get("ACTIONdeleteGame"):  # requested from viewGame.html
			gameId = request.form.get("gameId")
			userNames = gameId.split("_")
			data = checkTable.checkFromDraw(gameId)

			if data[3] == 0 or data[4] == 1:
				if data and userNames[0] == currentUser:
					modifyTable.deleteDrawGame(gameId)
					return render_template("drawSomething/drawSomething.html",
					                       error="The game was successfully deleted")

		elif request.form.get("ACTIONnewGameRequest"):  # drawNewPicture.html
			requestedUser = request.form.get("newGameRequestUsername")

			if requestedUser.strip() == currentUser.strip():
				return render_template("drawSomething/newGame.html", error="You can't request a game with yourself!",
				                       currentUser=currentUser)

			gameId = currentUser + "_" + requestedUser

			if checkTable.checkFromDraw(gameId):
				data = checkTable.checkFromDraw(gameId)
				if data[2]:
					return render_template("drawSomething/newGame.html",
					                       error="You have already started a game with this user!",
					                       currentUser=currentUser)

			if checkTable.checkIfLoginCorrect(requestedUser):
				randWord = None
				data = checkTable.checkFromDraw(gameId)

				if data:  # game already started therefore word already exists
					randWord = data[1]  # select random word from (id, word, image) tuple

				else:
					from random import randint
					from nouns import nouns as drawingWords

					i = randint(0, (len(drawingWords) - 1))
					randWord = drawingWords[i]  # new word selection if it is not already done

				if checkTable.checkFromDraw(gameId):  # game already exists

					return render_template("drawSomething/newGame.html",
					                       error="You have already started a game with this user!",
					                       currentUser=currentUser)
				else:
					modifyTable.addToDraw(gameId, randWord)
					return render_template("drawSomething/drawNewPicture.html", gameId=gameId,
					                       requestedUser=requestedUser,
					                       randomWord=randWord.title())

			else:
				return render_template("drawSomething/newGame.html", error="This user doesn't exist",
				                       currentUser=currentUser)

		elif request.form.get("ACTIONcheckGuess"):
			gameId = request.form.get("gameId")
			currentUser = decryptString(request.cookies.get("USERNAME"))

			userNames = gameId.split("_")

			if userNames[1] != currentUser:  # This would suggest user is doing some html form fuckery
				return render_template("drawSomething/drawSomething.html", error="Don't mess with the form please :)")

			data = checkTable.checkFromDraw(gameId)

			image = data[2]
			otherUser = userNames[1]
			word = data[1]

			guessWord = request.form.get("guessWord").lower()

			wordIsCorrect = checkTable.checkIfDrawingWordCorrect(gameId, guessWord)

			if wordIsCorrect:
				modifyTable.finishDrawGame(gameId)
				return render_template("drawSomething/guessWasCorrect.html", guessWord=guessWord.title())

			else:

				guessNum = modifyTable.updateDrawGuess(gameId)  # increments guesses remaining down by one
				if guessNum != 0:
					return render_template("drawSomething/guessDrawing.html", guess=guessNum, image=image,
					                            currentUser=currentUser,
					                            otherUser=otherUser, word=word, gameId=gameId)

				else:
					return render_template("drawSomething/outOfGuesses.html", otherUser=otherUser, word=word)

		return render_template("drawSomething/drawSomething.html", error="An unknown error occured")


@app.route("/games/drawsomethingsubmission/", methods=["GET", "POST"])
@loginRequired
def drawSomethingSubmission():
	if request.method == "GET":
		return render_template("drawSomething/submissionSuccess.html")

	elif request.method == "POST":
		image = request.form.get("image")
		gameId = request.form.get("gameId")

		modifyTable.addToDraw(gameId, image=image)

		return redirect("/games/drawsomethingsubmission/")


# bruh
@app.route("/bruh/")
def bruh():
	return render_template("bruh.html")


@app.route("/whatsnew/")
def whatsnew():
	return render_template("whatsNew.html")


# games index
@app.route("/games/")
def games():
	return render_template("games.html")


# tennis game
@app.route("/games/tennis/")
def tennis():
	return render_template("tennis.html")


# Rock paper scissors
@app.route("/games/rps/")
def rps():
	return render_template("rps.html")


# reaction speed game
@app.route("/games/reaction/")
def reaction():
	return render_template("reaction.html")


# handles leaderboard requests
@app.route("/games/leaderboardsubmission/", methods=["GET", "POST"])
@nocache
def submission():
	if request.method == "POST":
		username = request.form.get("username")
		if username.replace(" ", "") == "":
			return "ERROR: Please enter a username"

		time = request.form.get("score")

		try:
			nameScoreDict = {"name": str(username), "time": int(time)}
		except ValueError:
			return "ERROR: You cannot enter the same score twice..."

		with open("static/reactionLeaderboard.json", "r") as leaderboard:  # get data from file
			leaderboardData = json.load(leaderboard)  # loads json as list of dicts
			leaderboardData.append(nameScoreDict)  # adds new dict to list
			leaderboardData.sort(key=operator.itemgetter('time'))  # sorts data lowest to highest time

		with open("static/reactionLeaderboard.json", "w") as leaderboard:  # open leaderboard for writing
			finalData = json.dumps(leaderboardData)  # dump json to string
			leaderboard.write(finalData)  # replaces leaderboard.json with new values

		return redirect("/games/reactionleaderboard/", 302)

	return render_template("errors/404.html")


@app.route("/games/reactionleaderboard/")
def reactionLeaderboard():
	return render_template("reactionLeaderboard.html")


@app.route("/games/doctorb/", methods=["GET", "POST"])
@loginRequired
def doctorB():
	username = decryptString(request.cookies.get("USERNAME"))
	storedData = checkTable.checkFromSpace(username)
	storedScore = 0
	if storedData:
		storedScore = storedData[1]

	if request.method == "GET":
		return render_template("doctorB.html", username=username, score=storedScore)

	elif request.method == "POST":  # Handle XMLHTTPRequests
		correctPostID = checkTable.getFromMain(username)[3] == request.form.get("postID")
		if correctPostID:
			# changePostID
			modifyTable.addPostID(username)
			newScore = int(request.form.get("score"))
			if newScore > storedScore:
				modifyTable.updateSpaceScore(username, newScore)

				return str(newScore)

			return str(storedScore)
		else:
			raise ValueError("Incorrect postID")


@app.route("/games/doctorbLevel/", methods=["POST"])
@loginRequired
def doctorBLevels():
	username = decryptString(request.cookies.get("USERNAME"))
	postID = request.form.get("postID")
	postIDCorrect = checkTable.getFromMain(username)[3] == postID
	action = request.form.get("action")
	storedLevel = checkTable.checkFromSpace(username)[2]
	if postIDCorrect:
		if action == "get":
			return str(storedLevel)

		elif action == "set":
			newLevel = request.form.get("level")
			if newLevel > storedLevel + 2:
				raise ValueError("Levels can only be incremented by 1")
			else:
				modifyTable.updateSpaceScore(username, level=newLevel)
				return str(newLevel)

	else:
		raise ValueError("postID is incorrect")


@app.route("/games/interrogation/")
@loginRequired
def interrogation():
	if request.method == "GET":
		return render_template("interrogation.html")
	pass


@app.route("/getPostID/", methods=["POST"])
@loginRequired
def getPostId():
	username = decryptString(request.cookies.get("USERNAME"))
	postID = modifyTable.addPostID(username)

	return str(postID)


# Handles 404 errors
@app.errorhandler(404)
def notFound(e):
	return render_template("errors/404.html"), 404


# Handles 5** errors
@app.errorhandler(500)
def internalError(e):
	return render_template("errors/500.html", error=e), 500


if __name__ == "__main__":
	app.run(host="127.0.0.1", port=5000, debug=True)
