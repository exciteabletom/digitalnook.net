# This file allows gunicorn to act as reverse proxy to nginx
from app import app

if __name__ == "__main__":
	app.run()
