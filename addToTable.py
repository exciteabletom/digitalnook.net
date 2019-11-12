import sqlite3



def checkForName(name):
    """
    This function checks to see if the name the user has entered is already in the database

    """

    connection = sqlite3.connect("userdata.db")
    cursor = connection.cursor()

    queryForName = "SELECT name From main WHERE name = " + '"' + name + '"'
    cursor.execute(queryForName)
    names = cursor.fetchall()

    print(names)

    try:
        if name.upper() not in str(names).upper():
            print("name not in names")
            return True

        else:
            print("name is in names")
            return False

    except Exception as e:
        raise Exception("SQLERROR: " + str(e))


def addToMain(name, password):
    """
    Attempts to add the name, password and id of a new user into the 'main' Database
    """
    connection = sqlite3.connect("userdata.db")
    cursor = connection.cursor()
    try:


        if checkForName(name):
            intId = None

            with open("./static/latestId.txt", "r") as latestId:
                id = latestId.read() # parses string read from file to integer
                intId = int(id) + 1

            with open("./static/latestId.txt", "w") as latestId:
                latestId.write(str(intId))

            newDataTuple = (id, name, password)
            query = "INSERT INTO 'main' ('id', 'name', 'password') VALUES" + str(newDataTuple)  # inserts all new data into table

            cursor.execute(query)  # loads insertion of table

            connection.commit()  # commits new data into table

            return "Data was added to table successfully"

        else:
            raise ValueError("This name is already in use")

    except Exception as e:
        raise Exception("SQLERROR: " + str(e))

