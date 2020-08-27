#!/usr/bin/env bash
########################################################################
# add_js_licenses.sh - Copyright 2020, Thomas Chris Dougiamas
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

# This script prepends the GPLv3 license to all js files that don't already have it
# ref: https://www.gnu.org/software/librejs/free-your-javascript.html

if ! find add_js_licenses.sh &>/dev/null; then
	1>&2 printf 'Please run this script from it'"'"'s working directory E.g "./add_js_licenses.sh"\n'
	exit 1
fi

# Allow use of '**'
shopt -s globstar


for file in ../static/**/*.js; do
	if ! grep '@licstart' "$file" &>/dev/null; then
		printf '%s\n\n' "$(cat ../static/js/license.js)" | cat - "$file" > '/tmp/license_added'
		cat '/tmp/license_added' > "$file"

		printf 'License prepended to %s\n' "$file"
	fi
done

