from flask import Flask, render_template, request, redirect, send_from_directory, session, flash
import json
from nocache import nocache
import operator

import sqlite3  # SQL

from encryptPasswordFunc import encryptPassword

import addToTable
app = Flask(__name__)


@app.route('/robots.txt')
@app.route('/sitemap.xml')
def static_from_root():
    return send_from_directory("", request.path[1:])


# stops caching of leaderboard
@app.route("/static/reactionLeaderboard.json", host="digitalnook.net")
@nocache
def staticLeaderboard():
    return app.send_static_file("reactionLeaderboard.json")


# Default page
@app.route("/", host="digitalnook.net")
def index():
    return render_template("index.html")


# About page
@app.route("/about/", host="digitalnook.net")
def about():
    return render_template("about.html")


# login page
@nocache
@app.route("/login/", methods=["GET", "POST"], host="digitalnook.net")
def login():
    if request.method == "GET":
        return render_template("login.html")


# elif request.method == "POST":
#    username = request.username
#   with open("/static/userData.json", "r") as userData:
#      if username in userData:
#         pass
#
#           else:
#              return render_template("badRegister.html")


# Registration page
@nocache
@app.route("/register/", methods=["GET", "POST"], host="digitalnook.net")
def register():
    if request.method == "GET":
        return render_template("register.html")

    elif request.method == "POST":

        connection = sqlite3.connect("userData")
        cursor = connection.cursor()

        username = str(request.form.get("username"))
        password = str(request.form.get("password"))

        # encrypt password
        encryptedPassword = encryptPassword(password)
        strPassword = encryptedPassword.decode("utf-8")

        try:
            addToTable.addToMain(username, strPassword)

        except Exception as e:
            return render_template("badRegister.html")

        return render_template("index.html")

# DrawSomething game
@app.route("/games/drawsomething/", host="digitalnook.net")
def adventure():
    return render_template("drawsomething.html")


# bruh
@app.route("/bruh/", host="digitalnook.net")
def bruh():
    return render_template("bruh.html")


# games index
@app.route("/games/", host="digitalnook.net")
def games():
    return render_template("games.html")


# tennis game
@app.route("/games/tennis/", host="digitalnook.net")
def tennis():
    return render_template("tennis.html")


# Rock paper scissors
@app.route("/games/rps/", host="digitalnook.net")
def rps():
    return render_template("rps.html")


# Bomb Defusal Game
@app.route("/games/bomb/", host="digitalnook.net")
def bomb():
    return render_template("bomb.html")


# reaction speed game
@app.route("/games/reaction/", host="digitalnook.net")
def reaction():
    return render_template("reaction.html")


# handles leaderboard requests
@app.route("/games/leaderboardsubmission/", methods=["GET", "POST"], host="digitalnook.net")
@nocache
def submission():
    if request.method == "POST":
        username = request.form.get("username")
        if username.replace(" ", "") == "":
            return "ERROR: Please enter a username"

        time = request.form.get("score")

        try:
            nameScoreDict = {"name": str(username), "time": int(time)}
        except(ValueError):
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


@app.route("/games/reactionleaderboard/", methods=["GET"], host="digitalnook.net")
def leaderboard():
    return render_template("reactionLeaderboard.html")


# Handles 404 errors
@app.errorhandler(404)
def not_found(e):
    return render_template("404.html"), 404


if __name__ == "__main__":
    app.run(host="127.0.0.1", port=80, debug=True)
