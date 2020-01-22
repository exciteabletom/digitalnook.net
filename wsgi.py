# This file allows gunicorn to reverse proxy the application to nginx
from app import app

if __name__ == "__main__":
	app.run()
