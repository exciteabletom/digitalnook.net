#  RUNNING THIS WILL MAKE ALL PASSWORDS *NOT* ACCESSIBLE!!
#  BE CAREFUL!!
from cryptography.fernet import Fernet

check = input("Are you sure you want to generate a new private key? Please type: 'yes i am sure' ")


def newKey():
    key = Fernet.generate_key()  # make new private key
    with open("./static/loginKey.py", "wb") as loginKey:
        loginKey.write(key)  # write new key to file


if check.lower() == "yes i am sure":
    newKey()
    print("A new Key has been generated")

else:
    print("No private Keys were generated")
