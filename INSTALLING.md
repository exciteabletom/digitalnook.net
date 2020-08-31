# INSTALLING

## Automatic Install
If you are on a unix-based system just run `install.sh` from the root directory and the install will be automatically done.


## Manual Install
### Requirements for a working install
  - An empty sqlite3 database with the correct tables
  - python >3.6
  - All the required dependencies
  - A login encryption key
  - A virtual environment (optional)    

Do <a href='https://docs.python.org/3/library/venv.html'>this</a> before any of the other steps. (if you want a virtualenv)

Otherwise: 
- Create the tables with the schemas at `install/create_tables.sql`
- Install dependencies with pip using `install/requirements.txt`
- Create a long, randomised, byte string with the name `key` in `loginKey.py`   

## Running a dev server
If you created a virtualenv: run `source .venv/bin/activate`   
Run `python3 -m flask run` or `python3 app.py`

Have Fun!
