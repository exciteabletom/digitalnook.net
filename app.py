from flask import Flask, render_template
app = Flask(__name__)


# pie
@app.route('/pie', host='digitalnook.net')
def pie():
    return render_template('pie.html')

# Default page
@app.route('/',host='digitalnook.net')
def index():
    return render_template('index.html')
# bruh
@app.route('/bruh', host='digitalnook.net')
def bruh():
    return render_template('bruh.html')

# games index
@app.route('/games', host='digitalnook.net')
def games():
    return render_template('games.html')

# Rock paper scissors
@app.route('/games/rps', host='digitalnook.net')
def rps():
    return render_template('rps.html')

# Bomb Defusal Game
@app.route('/games/bomb', host='digitalnook.net')
def bomb():
    return render_template('bomb.html')

# reaction speed game
@app.route('/games/reaction', host='digitalnook.net')
def reaction():
    return render_template('reaction.html')

# Handles 404 errors
@app.errorhandler(404)
def not_found(e):
    return render_template("404.html")

# test for subdomains
#@app.route("/", subdomain="tom", host="digitalnook.net")

#def tom():
#    return render_template("test.html")

if __name__ == '__main__':
#    website_url = "digitalnook.net"
#    @app.config['SERVER NAME'] = website_url
    app.run(host="10.1.1.50", port='80')

