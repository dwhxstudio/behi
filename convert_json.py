import glob
import json

data = []
# images = sorted(glob.glob("./textures/ss/*.jpg"))
images = sorted(glob.glob("./textures/shots/*"))
for path in images:
    item = {"path": "."+str(path).replace('./', '/')}
    data.append(item)
print(data)
jsonData = json.dumps(data)
jsonFile = open("data.json", "w")
jsonFile.write(jsonData)
jsonFile.close()
