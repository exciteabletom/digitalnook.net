import sqlite3
from string import Template

from loginKey import key

from cryptography.fernet import Fernet

cipher = Fernet(key)


def checkFromMain(name, password=0):
    """
    Returns True if the name and password entered match the table data

    Otherwise, False
    """

    try:
        connection = sqlite3.connect("userdata.db")
        cursor = connection.cursor()

        cursor.execute("SELECT * from main WHERE name = (?) ", (name,))

        rawData = cursor.fetchall()
        print(rawData)
        if rawData:
            if password == 0:
                return True

            data = rawData[0]  # sqlite returns a list of tuples. Since I only have one tuple I need to isolate it
            tablePassword = data[2]  # select password from tuple

            tableEncodedPassword = str.encode(tablePassword)  # we have to convert the normal string to a byte string
            decryptedTablePassword = cipher.decrypt(tableEncodedPassword)

            finalTablePassword = decryptedTablePassword.decode()

            if password == finalTablePassword:
                print("YES")
                return data

            else:
                print("NO")
                return False

        else:
            raise Exception("The program exited for an unknown reason")

    except Exception as e:
        raise Exception(e)
