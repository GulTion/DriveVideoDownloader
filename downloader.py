import requests
from urllib.parse import unquote
import sys

arg = sys.argv
url = f"https://docs.google.com/get_video_info?docid={arg[1]}"
# print(url)
s= requests.Session()
r = s.get(url)
data = r.content.decode()

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
urlDownload = parseURL(data)['18']
print(urlDownload)
print(sys.argv)
r = s.get(urlDownload)
with open(arg[2],'wb') as f:
    f.write(r.content)