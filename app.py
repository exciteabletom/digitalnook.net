# WELCOME TO MY SPAGHETTI!
# I hope you enjoy your stay
import json
import operator
from functools import wraps

from flask import Flask, render_template, request, redirect, send_from_directory

import addToTable
import checkFromTable
from encryptionManager import encryptString, decryptString
from loginKey import key
from nocache import nocache

app = Flask(__name__)
Flask.secret_key = key


# PROD ONLY, THIS BREAKS DEV because of localhost
# app.config["SERVER_NAME"] = "digitalnook.net"


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

		if "USERNAME" in request.cookies and "PASSWORD" in request.cookies:
			encryptedUsername = request.cookies.get("USERNAME")
			encryptedPassword = request.cookies.get("PASSWORD")

			username = decryptString(encryptedUsername)
			password = decryptString(encryptedPassword)
			print(username, password, encryptedUsername, encryptedPassword)
			validLogin = checkFromTable.checkFromMain(username, password)  # true if login cookies are valid credentials

			if validLogin:
				return appRoute(*args, **kwargs)
			else:
				return redirect("/login/")

		else:
			return redirect("/login/")

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
	return render_template("index.html")


# About page
@app.route("/about/")
def about():
	return render_template("about.html")


# login page
@nocache
@app.route("/login/", methods=["GET", "POST"])
def login():
	if request.method == "GET":
		return render_template("login.html")

	elif request.method == "POST":
		username = str(request.form.get("username"))
		password = str(request.form.get("password"))

		if request.cookies.get("USERNAME"):
			return render_template("login.html", error="You are already logged in, would you like to logout?")

		try:

			if checkFromTable.checkFromMain(username, password):  # returns true if login is valid
				resp = app.make_response(redirect("/"))

				resp.set_cookie("USERNAME", encryptString(username))
				resp.set_cookie("PASSWORD", encryptString(password))

				return resp

			else:
				return render_template("login.html", error="""Your username or password was incorrect""")

		except ValueError:
			return render_template("login.html", error="""Your login details were not valid.
                                                        Would you like to register?""")


# Registration page
@nocache
@app.route("/register/", methods=["GET", "POST"])
def register():
	if request.method == "GET":
		return render_template("register.html")

	elif request.method == "POST":

		username = str(request.form.get("username"))
		password = str(request.form.get("password"))

		if "_" in username:
			return render_template("register.html", error="Underscores are not allowed in names")

		# encrypt password
		encryptedPassword = encryptString(password)
		strPassword = encryptedPassword.decode("utf-8")

		successfulRegister = addToTable.addToMain(username.strip(), strPassword.strip())
		if successfulRegister:
			newUsername = encryptString(username)

			resp = app.make_response(redirect("/"))
			resp.set_cookie("USERNAME", newUsername)
			resp.set_cookie("PASSWORD", strPassword)

			return resp

		elif not successfulRegister:
			return render_template("register.html", error="This name is already in use")

		else:
			return render_template("register.html", error="An unknown error occurred")


# DrawSomething game
@app.route("/games/drawsomething/", methods=["GET", "POST"])
@loginRequired
def drawSomething():
	"""
	Interprets user actions to render different templates, allows the game to work with different templates on one URL
	"""
	if request.method == "GET":
		return render_template("drawSomething/drawSomething.html")

	elif request.method == "POST":

		currentUser = decryptString(request.cookies.get("USERNAME"))  # gets current user from cookies

		# Interprets user actions in the drawsomething forms
		if request.form.get("ACTIONnewGame"):
			return render_template("drawSomething/newGame.html", currentUser=currentUser)

		elif request.form.get("ACTIONcontinueGame"):

			activeGames = checkFromTable.checkForActiveDrawingGames(currentUser)
			received = "No received drawings were found!"
			sent = "No sent drawings were found!"
			if activeGames:

				if activeGames.get("received"):
					received = activeGames.get("received")

				if activeGames.get("sent"):
					sent = activeGames.get("sent")

			return render_template("drawSomething/continueGame.html", currentUser=currentUser, sent=sent,
			                       received=received)

		elif request.form.get("ACTIONrequestForDrawing"):
			gameId = request.form.get("requestForDrawing")
			usernames = gameId.split("_")  # gameId is sendingPlayer_receivingPlayer
			data = checkFromTable.checkFromDraw(gameId)
			print("usernames:", usernames)
			return render_template("drawSomething/guessDrawing.html", currentUser=currentUser, gameId=gameId,
			                       otherUser=usernames[1], image=data[2], word=data[1])

		elif request.form.get("ACTIONnewGameRequest"):
			requestedUser = request.form.get("newGameRequestUsername")

			if requestedUser.strip() == currentUser.strip():
				return render_template("drawSomething/newGame.html", error="You can't request a game with yourself!",
				                       currentUser=currentUser)

			if checkFromTable.checkFromMain(requestedUser):
				gameId = currentUser + "_" + requestedUser
				randWord = None
				data = checkFromTable.checkFromDraw(gameId)

				if data:  # game already started therefore word already exists
					randWord = data[1]  # select random word from (id, word, image) tuple

				else:
					from random import randint
					from nouns import nouns as drawingWords

					i = randint(0, (len(drawingWords) - 1))
					randWord = drawingWords[i]  # new word selection if it is not already done

				if addToTable.addToDraw(gameId, randWord):  # game already exists

					return render_template("drawSomething/newGame.html",
					                       error="You have already started a game with this user!",
					                       currentUser=currentUser)
				else:
					return render_template("drawSomething/drawNewPicture.html", gameId=gameId,
					                       requestedUser=requestedUser,
					                       randomWord=randWord.title())

			else:
				return render_template("drawSomething/newGame.html", error="This user doesn't exist",
				                       currentUser=currentUser)

		elif request.form.get("guessWord"):
			return "wip"

		return render_template("drawSomething/drawSomething.html")


@app.route("/games/drawsomethingsubmission/", methods=["GET", "POST"])
@loginRequired
def drawSomethingSubmission():
	if request.method == "GET":
		return render_template("drawSomething/submissionSuccess.html")

	elif request.method == "POST":
		image = request.form.get("image")
		gameId = request.form.get("gameId")

		addToTable.addToDraw(gameId=gameId, image=image)

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
@loginRequired
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

		return redirect("/games/reactionleaderboard/", code="302")

	return render_template("404.html")


@app.route("/games/reactionleaderboard/", methods=["GET"])
def reactionLeaderboard():
	return render_template("reactionLeaderboard.html")


# Handles 404 errors
@app.errorhandler(404)
def not_found(e):
	return render_template("404.html"), 404


if __name__ == "__main__":
	app.run(host="127.0.0.1", port=5000, debug=True)
