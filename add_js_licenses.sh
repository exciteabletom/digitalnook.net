#!/usr/bin/env bash
# This script appends the GPLv3 license to all js files that don't already have it
# ref: https://www.gnu.org/software/librejs/free-your-javascript.html

# Allow use of '**'
shopt -s globstar


for file in ./static/**/*.js; do
	printf '%s' "$file"
	if ! grep '@licstart' "$file"; then
		printf '%s' "$(cat static/js/license.js)" | cat - "$file" > "$file"
	fi
done


