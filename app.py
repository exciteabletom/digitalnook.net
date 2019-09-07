from flask import Flask, render_template
application = Flask(__name__)


# pie
@application.route('/pie', host='digitalnook.net')
def pie():
    return render_template('pie.html')

# Default page
@application.route('/',host='digitalnook.net')
def index():
    return render_template('index.html')

# bruh
@application.route('/bruh', host='digitalnook.net')
def bruh():
    return render_template('bruh.html')

# games index
@application.route('/games', host='digitalnook.net')
def games():
    return render_template('games.html')

# Rock paper scissors
@application.route('/games/rps', host='digitalnook.net')
def rps():
    return render_template('rps.html')

# Bomb Defusal Game
@application.route('/games/bomb', host='digitalnook.net')
def bomb():
    return render_template('bomb.html')

# Handles 404 errors
@application.errorhandler(404)

def not_found(e):
    return render_template("404.html")

# test for subdomains
#@application.route("/", subdomain="tom", host="digitalnook.net")

#def tom():
#    return render_template("test.html")

if __name__ == '__main__':
#    website_url = "digitalnook.net"
#    @application.config['SERVER NAME'] = website_url
    application.run(host="10.1.1.50", port='80')

