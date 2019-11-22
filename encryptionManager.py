from cryptography.fernet import Fernet
from loginKey import key

cipher = Fernet(key)


def encryptString(plainString):
    byteString = str.encode(plainString)
    encryptedString = cipher.encrypt(byteString)
    return encryptedString


def decryptString(encryptedString):
    byteString = str.encode(encryptedString)
    decryptedString = cipher.decrypt(byteString)
    return decryptedString
