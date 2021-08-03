
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
    print("HERE",path)
    r = s.get(urlDownload)
    with open(path,'wb') as f:
        f.write(r.content)
        print(path)

def parseURL(urlC):
    qual = {}
    urlC = urlC.split('&')
    print(urlC)
    fmt_map = urlC[17]
    qstring = fmt_map[15:].split("%2C")
    for i in qstring:
        sma = unquote(i).split("|")
        qual[sma[0]] = sma[1]
    
    return qual

downloader(arg[1], arg[2], arg[3])
