#!/usr/bin/env bash
########################################################################
# install.sh - Copyright 2020, Thomas Chris Dougiamas
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

# If not in root dir of project
# TODO: There has to be a better way to do this
if ! find 'app.py' &>/dev/null; then
	1>&2 out 'Please run this script from the project root directory. E.g "./install.sh"'
	exit 1
fi

check() {
	message="$1"
	printf '%s (y/n) ' "$message"

	read -r confirm
	if ! [[ "$confirm" == 'y' || "$confirm" == 'Y' ]]; then
		return 1
	else
		return 0
	fi

}

out() {
	printf -- '\033[1;31m%s\033[0m\n' "$1"
}


out '===============================================
This program will overwrite existing databases!
ALL YOUR DATA AND LOGIN KEY *WILL* BE DELETED.
YOU WILL BE RESET TO A CLEAN INSTALL.
===============================================
'

if ! check 'Are you sure you want to continue?'; then
	exit 1
fi


if check 'Do you want to create a virtualenv?'; then
	out ':: CREATING VIRTUALENV ".venv"'
	venv=1
	rm -rf .venv
	python3 -m venv .venv
	source .venv/bin/activate
	out ':: DONE'
fi
	
out ':: UPDATING PIP'
python3 -m pip install --upgrade pip
out ':: DONE'

out ':: INSTALLING DEPENDENCIES'
python3 -m pip install -r install/requirements.txt
out ':: DONE'

out ':: CREATING NEW DATABASE'
rm -f userdata.db
sqlite3 -line userdata.db "$(cat ./install/create_tables.sql)"
out ':: DONE'

out ':: CREATING latestId.txt'
printf '0' > static/latestId.txt
out ':: DONE'

out ':: CREATING LOGIN KEY'
python3 ./generateKey.py -f
out ':: DONE
'

if [[ "$venv" ]]; then
	printf ':: Use the virtualenv with "source .venv/bin/activate"\n'
fi
printf ':: Run the server with "python3 -m flask run"'






	

