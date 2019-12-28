lst = None
with open("formattedNouns.txt", "r") as n:
	data = n.read()
	lst = data.split("\n")

with open("nouns.txt", "w") as n:
	n.write(str(lst))
