finalData = []
with open("./nouns.txt", "r") as nouns:
	raw = nouns.read()

	finalData = raw.split("\n")

with open("./formattedNouns.txt", "w") as formatted:
	formatted.write(str(finalData))
