# WELCOME TO MY SPAGHETTI!
# I hope you enjoy your stay
import json
import operator
from functools import wraps

from flask import Flask, render_template, request, redirect, send_from_directory, session

import addToTable
import checkFromTable
from loginKey import key
from nocache import nocache
from encryptionManager import encryptString, decryptString

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
    Reaction game will also be ported over to use this system once I get some time
    """

    @wraps(appRoute)
    def wrapper(*args, **kwargs):

        if "USERNAME" in request.cookies and "PASSWORD" in request.cookies:
            encryptedUsername = request.cookies.get("USERNAME")
            encryptedPassword = request.cookies.get("PASSWORD")

            byteUsername = decryptString(encryptedUsername)
            bytePassword = decryptString(encryptedPassword)

            username = byteUsername.decode()
            password = bytePassword.decode()

            validLoginBool = checkFromTable.checkFromMain(username, password)  # true if login cookies valid

            if validLoginBool:
                return appRoute(*args, **kwargs)
            else:
                return redirect("/login/")

        elif "USERNAME" not in session:
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
@loginRequired  # just for testing m8 TODO: remove for prod
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
            return render_template("login.html", error="You are already logged in")

        try:

            if checkFromTable.checkFromMain(username, password):  # returns true if login is valid
                resp = app.make_response(redirect("/"))

                resp.set_cookie("USERNAME", encryptString(username))
                resp.set_cookie("PASSWORD", encryptString(password))

                return resp

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

        # encrypt password
        encryptedPassword = encryptString(password)
        strPassword = encryptedPassword.decode("utf-8")

        try:
            data = addToTable.addToMain(username, strPassword)
            if data[0]:
                newUsername = encryptString(username)

                resp = app.make_response(redirect("/"))
                resp.set_cookie("USERNAME", newUsername)
                resp.set_cookie("PASSWORD", strPassword)

                return resp

            elif not data[0]:
                return render_template("register.html", error=data[1])

        except:
            return render_template("register.html", error="This name is already in use")


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

        currentUser = decryptString(request.cookies.get("USERNAME")).decode()  # gets current user from cookies

        # Interprets user actions
        if request.form.get("newGame"):
            return render_template("drawSomething/newGame.html", currentUser=currentUser)

        elif request.form.get("continueGame"):
            pass

        elif request.form.get("newGameRequest"):
            requestedUser = request.form.get("newGameRequestUsername")

            if requestedUser == currentUser:
                print("here")
                return render_template("drawSomething/newGame.html", error="You can't request a game with yourself!", currentUser=currentUser)
            try:
                if checkFromTable.checkFromMain(requestedUser):
                    return render_template("drawSomething/drawNewPicture.html")
            except Exception:
                return render_template("drawSomething/newGame.html", error="This user doesn't exist", currentUser=currentUser)

        return render_template("drawSomething/drawSomething.html")


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

        return redirect(("/games/reactionleaderboard/"), code="302")

    return render_template("404.html")


@app.route("/games/reactionleaderboard/", methods=["GET"])
def leaderboard():
    return render_template("reactionLeaderboard.html")


# Handles 404 errors
@app.errorhandler(404)
def not_found(e):
    return render_template("404.html"), 404


if __name__ == "__main__":
    app.run(host="127.0.0.1", port=5000, debug=True)
