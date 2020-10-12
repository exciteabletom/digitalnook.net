#!/usr/bin/env python3
########################################################################
# install.py - Copyright 2020, Thomas Chris Dougiamas
#
# This file is part of Digital Nook.
#
# Digital Nook is free software: you can redistribute it and/or modify
# it under the terms of the GNU General Public License as published by
# the Free Software Foundation, either version 3 of the License, or
# (at your option) any later version.
#
# Digital Nook is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
# GNU General Public License for more details.
#
# You should have received a copy of the GNU General Public License
# along with Digital Nook.  If not, see <https://www.gnu.org/licenses/>.
########################################################################
"""
Functions relating to the install process.

main() is  the entrypoint for an interactive install.
"""

import os
import sys
import platform
import venv
import subprocess
import shutil
from urllib.request import urlopen
from pathlib import Path

import constants


def is_unix():
	"""
	Check if the OS is unix-based or not.

	:r_type: bool
	:return: True if unix-based, False otherwise
	"""

	# TODO: More operating systems covered here
	if platform.system() in ("Linux", "Darwin"):
		return True
	else:
		return False


def status(message=None):
	"""
	Void function
	Prints a formatted status message. 
	If no status message prints 'done'
	"""

	if not message:
		message = "Done\n"

	print(f">>> {message}")


def check(question: str):
	"""
	Ask user a Yes/No question.

	:param question: The question the user will be asked
	:r_type: bool
	:return: True if user said yes, false otherwise
	"""

	yes_or_no = input(f"{question} (y/n): ").lower()

	if yes_or_no == "y":
		print("\n", end="")
		return True
	else:
		return False


def create_venv():
	"""
	Void Function
	Creates a new virtual environment with name .venv in the working directory.
	:r_type: bool
	:return: True on success, false otherwise
	"""

	try:
		venv.create(".venv", with_pip=True, symlinks=True)

	except:
		shutil.rmtree(".venv")
		venv.create(".venv", with_pip=True)

	return True


def download_javascript():
	"""
	Download javascript libraries to reduce dependency on CDNs.
	Not included in the main repository because it inflates the size and messes with stats.
	"""
	try:
		os.mkdir(str(Path("static/js/lib/")))
	except FileExistsError:
		pass

	libs = (
		"https://cdn.jsdelivr.net/npm/phaser@3.24.1/dist/phaser.min.js",
		"https://code.jquery.com/jquery.min.js",
	)

	for lib in libs:
		# Get the name of the file
		name = lib.split("/")[-1]
		print(f"Downloading '{name}' from '{lib}'")

		# Open url
		with urlopen(lib) as js_url:
			# Get byte data from url
			js_bytes = js_url.read()
			# bytes to unicode
			js = js_bytes.decode("utf-8")

			with open(str(Path(f"static/js/lib/{name}")), "w") as f:
				# Write unicode to file
				f.write(js)


def main():
	"""
	Main entrypoint. 

	Installs a new Digital Nook dev environment.
	"""

	# Get the version number as a float
	# E.g. '3.6.5' becomes 3.6
	py_ver = platform.python_version().split(".")
	py_ver = float(".".join(py_ver[:2]))

	# f strings not used here for compatibility with <3.6
	if py_ver < constants.PYTHON_VERSION:
		print("Your python version must be " + constants.PYTHON_VERSION + " or newer")
		sys.exit(1)

	# Where the python binary is
	python_bin = "python3"

	# OS agnostic file seperator
	# '/' on *nix '\\' on Windows
	fs_sep = str(Path("/"))

	script_path = sys.argv[0]

	if fs_sep in script_path:
		# Get the directory the script is in
		script_dir_lst = script_path.split(fs_sep)[:-1]
		script_dir = fs_sep.join(script_dir_lst)

		# Change to that directory
		os.chdir(script_dir)

	# It is now safe to assume that the working directory
	# is the project's root.

	# Quick are you sure check
	if not check("This script will delete any existing databases, configs, and login keys.\nAre you sure?"):
		sys.exit(0)

	if check("Do you want to create a virtual environment?\nThis is highly recommended."):
		status("Creating virtual environment")
		try:
			shutil.rmtree('.venv')
		except FileNotFoundError:
			pass

		if not create_venv():
			print("Error creating a virtual environment")
			sys.exit(1)

		if is_unix():
			python_bin = str(Path(".venv/bin/python3"))
		else:
			python_bin = str(Path(".venv/Scripts/python.exe"))

		# Update pip and setuptools
		subprocess.call([python_bin, "-m", "pip", "install", "--upgrade", "pip", "setuptools"])

		status()

	status("Installing dependencies")
	subprocess.call([python_bin, "-m", "pip", "install", "-r", "install/requirements.txt"])
	status()

	status("Creating new database")
	try:
		os.remove("userdata.db")
	# If fresh install
	except FileNotFoundError:
		pass

	subprocess.call([python_bin, "install/create_tables.py"])
	status()

	status("Installing JavaScript libraries")
	download_javascript()
	status()

	status("Creating latestId flatfile")
	with open("static/latestId.txt", "w") as f:
		f.write("0")
	status()

	status("Creating login key")
	subprocess.call([python_bin, "generateKey.py", "-f"])
	status()

	status("Copying default config file")
	shutil.copyfile(str(Path("install/config.py.default")), "config.py")
	status()

	if is_unix():
		source_instruct = ". .venv/bin/activate"
	else:
		source_instruct = ".venv/Scripts/activate.bat"

	print(
		f"All tasks done! The development server is now installed.\n\n"
		f"If you made a virtual environment activate it with '{source_instruct}'\n"
		f"You can run the development server with 'python app.py'\n",
	)


# Only run if being run from command-line, not imported.
if __name__ == "__main__":
	main()
