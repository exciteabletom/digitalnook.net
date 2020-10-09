########################################################################
# crypto.py - Copyright 2020, Thomas Chris Dougiamas
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
Functions relating to cryptography.
"""
from cryptography.fernet import Fernet

from loginKey import key

cipher = Fernet(key)


def encryptString(plainString):
	byteString = str.encode(plainString)
	encryptedString = cipher.encrypt(byteString)
	return encryptedString.decode("UTF-8")


def decryptString(encryptedString):
	byteString = str.encode(encryptedString)
	decryptedString = cipher.decrypt(byteString)
	return decryptedString.decode("UTF-8")

