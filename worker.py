import json
import os

f = open("[APPLIED] GATE 52.83GBo1hjHksjxMKbbIs3EOaR5f80qPDsw9ecgS.json")

dump = json.loads(f.read())
print(dump['name'])
def recursion(obj, p):
    if obj.get("type")=='folder':
        os.popen(f'cd "{p}" & mkdir "{obj["""name"""]}"')
        for folder in obj['items']:
            recursion(folder, p+"/"+obj['name'])
    else:
        if obj.get("mimeType")=="video/mp4":
            print(p+"/"+obj['name'])


recursion(dump, "df")
