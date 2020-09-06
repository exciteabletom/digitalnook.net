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
from pathlib import Path


# OS agnostic file seperator
fs_sep = str(Path("/"))

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
		print(unix_os)
		if unix_os:
			# This might fail on FAT filesystems or on windows
			venv.create(".venv", with_pip=True, symlinks=True)
		else:
			venv.create(".venv", with_pip=True)

	except:
		# Fallback command
		try:
			venv.create(".venv", with_pip=True)
		except:
			return False
	
	return True



def main():
	"""
	Main entrypoint. Installs a new Digital Nook dev environment.
	"""

	# If the operating system is unix based or not
	unix_os = False

	# TODO: More operating systems covered here
	if platform.system() in ("Linux", "Darwin"):
		unix_os = True

	# Where the python binary is
	python_bin = "python3"

	script_path = sys.argv[0]
	script_dir = ""

	if fs_sep in script_path:
		# Get the directory the script is in
		script_dir_lst = script_path.split(fs_sep)[:-1]
		script_dir = fs_sep.join(script_dir_lst)

		# Change to that directory
		os.chdir(script_dir)

	# It is now safe to assume that the working directory
	# is the project's root.

	# Quick are you sure check
	if not check("This script will delete any existing databases and login keys.\nAre you sure?"):
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

		if unix_os:
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

	status("Creating latestId flatfile")
	with open("static/latestId.txt", "w") as f:
		f.write("0")
	status()

	status("Creating login key")
	subprocess.call([python_bin, "generateKey.py", "-f"])
	status()

	if unix_os:
		source_instruct = ". .venv/bin/activate"
	else:
		source_instruct = ".venv\\Scripts\\activate.bat"

	print(f"""All tasks done!
If you made a virtual environment activate it with '{source_instruct}'
You can run the developmentserver with 'python -m flask run'
""")	


if __name__ == "__main__":
	main()
