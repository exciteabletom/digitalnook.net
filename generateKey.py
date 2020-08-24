########################################################################
# generateKey.py - Copyright 2020, Thomas Chris Dougiamas
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
Generates a new login key, used for decryption and encryption.
"""

# RUNNING THIS WILL MAKE ALL PASSWORDS *NOT* ACCESSIBLE!!
# BE CAREFUL!!
from cryptography.fernet import Fernet

check = input("Are you sure you want to generate a new private key? Please type: 'yes i am sure' ")


def newKey():
	key = Fernet.generate_key()  # make new private key
	with open("./loginKey.py", "wb") as loginKey:
		loginKey.write("key = ?".format(key))  # write new key to file


if check.lower() == "yes i am sure":
	newKey()
	print("A new Key has been generated")

else:
	print("No private Keys were generated")
