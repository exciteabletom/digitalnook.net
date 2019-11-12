from cryptography.fernet import Fernet
from loginKey import key

cipher = Fernet(key)


def encryptPassword(password):
    bytePassword = str.encode(password)
    encryptedPassword = cipher.encrypt(bytePassword)
    return encryptedPassword
