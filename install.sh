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

printf -- \
'------------------------------\n
This program will overwrite existing databases!\n\n

THIS SCRIPT IS NOT PRODUCTION READY!!!\n
*EXIT NOW* IF YOU HAVE ALREADY MADE A DATABASE\n
------------------------------\n\n'

sleep 45

# If not in root dir of project
if ! find 'app.py'; then
	1>&2 printf 'Please run this script from the project root directory. E.g "./install.sh"'
	exit 1
fi

printf ':: CREATING NEW DATABASE\n'
rm -f userdata.db
sqlite3 -line userdata.db "$(cat ./install/create_tables.sql)"
printf ':: DONE\n'

printf ':: CREATING LOGIN KEY\n'
python3 ./generate_key.py -f
printf ':: DONE\n'

printf ':: INSTALLING DEPENDENCIES\n'
env python3 -m pip install -r install/requirements.txt
printf ':: DONE\n'





	

