from flask import Flask, render_template, url_for, request, redirect, flash
import os
import json
from nocache import nocache

app = Flask(__name__, static_url_path="/static/")

# stops caching of leaderboard
@app.route("/static/leaderboard.json", host="digitalnook.net")
@nocache
def staticLeaderboard():
	return app.send_static_file("leaderboard.json")

# pie
@app.route("/pie/", host="digitalnook.net")
def pie():
    return render_template("pie.html")

# Default page
@app.route("/",host="digitalnook.net")
def index():
    return render_template("index.html")
# About page
@app.route("/about/",host="digitalnook.net")
def about():
    return render_template("about.html")

# bruh
@app.route("/bruh/", host="digitalnook.net")
def bruh():
    return render_template("bruh.html")

# games index
@app.route("/games/", host="digitalnook.net")
def games():
    return render_template("games.html")

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
		time = request.form.get("score")
		nameScoreDict = {"name": username, "time": time}
	
		with open("static/leaderboard.json", "r") as leaderboard: # get data from file
			leaderboardData = leaderboard.read()
			newLeaderboard = leaderboardData[:-2]
		with open("static/leaderboard.json", "w") as leaderboard: #replace file with old contents + new
			dictToJson = json.dumps(nameScoreDict)
			leaderboard.write(newLeaderboard + "," + dictToJson + "]\n") # appends to leaderboard.json
		
		#flash("Your score has been submitted")
		return redirect(("/games/leaderboard"), code="302")
	
	return "looks like you might have the wrong link..."

@app.route("/games/leaderboard/", methods=["GET"], host="digitalnook.net")
@nocache
def leaderboard():	
	return render_template("leaderboard.html")

# Handles 404 errors
@app.errorhandler(404)
def not_found(e):
	render_template("404.html")

if __name__ == "__main__":
    app.run(host="10.1.1.50", port="80")

