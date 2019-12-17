finalData = []
with open("./nouns.txt", "r") as nouns:
	rawData = nouns.readlines()
	newList = []
	for i in rawData:
		new = i.replace(" ", "")
		newNew = new.replace("\n", "")
		newNewNew = newNew.replace(".", "")
		newNewNewNew = "".join([a for a in newNewNew if not a.isdigit()])

		if newNewNewNew == "":
			continue
		else:
			newList.append(newNewNewNew)

	finalData = newList

with open("./formattedNouns.txt", "w") as formatted:
	formatted.write(str(finalData))
