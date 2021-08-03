import json
import os

f = open("/content/DriveVideoDownloader/--Mastering Data Structures & Algorithms using C and C++o1B3XH4PTmpUerDDkLnxqxgoKtfo6XuY9T.json")

dump = json.loads(f.read())

import requests
from urllib.parse import unquote
import sys

arg = sys.argv

def downloader(id, path, q):
    url = f"https://docs.google.com/get_video_info?docid={id}"
    s= requests.Session()
    r = s.get(url)
    data = r.content.decode()
    urlDownload = parseURL(data)[str(q)]
    r = s.get(urlDownload)
    with open(path,'wb') as f:
        f.write(r.content)
        print(path)

def parseURL(urlC):
    qual = {}
    urlC = urlC.split('&')
    fmt_map = urlC[17]
    qstring = fmt_map[15:].split("%2C")
    for i in qstring:
        sma = unquote(i).split("|")
        qual[sma[0]] = sma[1]
    
    return qual


# urlDownload = parseUrl(data)



def recursion(obj, p):
    if obj.get("type")=='folder':
        os.popen(f"""cd {'"'+p+'"'} && mkdir {'"'+obj.get("name")+'"'}""")
        for folder in obj['items']:
            recursion(folder, p+"/"+obj['name'])
    else:
        if obj.get("mimeType")=="video/mp4":
            # print(p+"/"+obj['name'])
            g = p+"/"+obj['name']
            os.popen(f'python /content/DriveVideoDownloader/downloader.py {obj.get("id")} "{g}" 22')


recursion(dump, "/content/drive/MyDrive/unflag/18")
#0.0.2