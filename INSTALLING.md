# INSTALLING
This file serves as a guide and also a personal reference for me when setting up a dev environment.     

## Requirements for a working install
If you want to install your own instance of this site for some reason, you will have to provide the following things:
  - An empty sqlite3 database with the correct tables
  - python >3.6
  - All the required dependencies
  - A login encryption key
  - A virtual environment (optional)    

## Creating a virtual environment (optional)
Do <a href='https://docs.python.org/3/library/venv.html'>this</a> before any of the other steps.    

## Automatic Install (experimental)
This is all automated in the `install.sh` script (Linux Only). EXPERIMENTAL!!     

## Manual Install
Otherwise: 
- Create the tables with the schemas at `install/create_tables.sql`
- Install dependencies with pip using `install/requirements.txt`
- Create a long, randomised, byte string with the name `key` in `/loginKey.py`   

## Running a development environment
- Comment out the `Talisman()` wrapper at the top of `app.py`
- Run `python3 -m flask run`     

Have Fun!
