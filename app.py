from flask import Flask, render_template, url_for, request, redirect, flash
import os
import json
from nocache import nocache
import operator

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

# tennis game
@app.route("/games/tennis", host="digitalnook.net")
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
			
		with open("static/leaderboard.json", "r") as leaderboard: # get data from file
			leaderboardData = json.load(leaderboard) # loads json as list of dicts
			leaderboardData.append(nameScoreDict) # adds new dict to list
			leaderboardData.sort(key=operator.itemgetter('time')) # sorts data lowest to highest time
		
		with open("static/leaderboard.json", "w") as leaderboard: # open leaderboard for writing
			finalData = json.dumps(leaderboardData) # dump json to string
			leaderboard.write(finalData) #replaces leaderboard.json with new values

		return redirect(("/games/leaderboard"), code="302")
	
	return render_template("404.html")

@app.route("/games/leaderboard/", methods=["GET"], host="digitalnook.net")
def leaderboard():	
	return render_template("leaderboard.html")

# Handles 404 errors
@app.errorhandler(404)
def not_found(e):
	render_template("404.html")

if __name__ == "__main__":
    app.run(host="10.1.1.50", port="80", debug=True)

