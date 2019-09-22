from flask import Flask, render_template, request, url_for, redirect, flash
app = Flask(__name__, static_url_path="/static")

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
@app.route("/games/reaction/", methods=["GET", "POST"], host="digitalnook.net")
def reaction():
	if request.method == "POST":
		username = request.form.get("username")
		score = request.form.get("score")
		if username != "Enter Name":
			leaderboard = open("static/leaderboard.csv", "a")
			leaderboard.write(str(username) + "," + str(score))
			leaderboard.close()	

	return render_template("reaction.html")
@app.route("/games/leaderboard", host="digitalnook.net")
def leaderboard():	
	render_template("leaderboard.html")

# Handles 404 errors
@app.errorhandler(404)
def not_found(e):
	render_template("404.html")
if __name__ == "__main__":
    app.run(host="10.1.1.50", port="80")

