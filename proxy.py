import json
from os import environ

import mitmproxy.http

domain = environ.get("kouyu100-domain")

def change_response(flow: mitmproxy.http.HTTPFlow):
    change_list = [
        {
            "host": "my7.kouyu100.com",
            "path": "/ArivocPluginsH5/recorder/arivoc.recorder.js"
        },
        {
            "host": "static2.kouyu100.com",
            "path": "/ArivocPluginsH5/CourseRead/arivoc.course.read.js"
        },
        {
            "host": "static2.kouyu100.com",
            "path": "/ArivocPluginsH5/player/arivoc.player.js"
        },
        {
            "host": "static2.kouyu100.com",
            "path": "/ArivocPluginsH5/Word2Minutes/arivoc.word.2minutes.js"
        },
        {
            "host": "static2.kouyu100.com",
            "path": "/ArivocPluginsH5/ChoosePicByWord/arivoc.choose.picture.js"
        }
    ]
    
    for item in change_list:
        if flow.request.host == item["host"] and item["path"].replace("${domain}", domain) in flow.request.path:
            flow.response.content = open(f"./local_replace_files/{item["host"]}{item["path"]}", "rb").read()
            break
        
        if "getW2mWordAssignments.action" in flow.request.path:
            W2mWordAssignments = flow.response.json()
            W2mWordAssignments["payFlag"] = 1
            flow.response.content = json.dumps(W2mWordAssignments, ensure_ascii=False).encode("utf-8")

class LocalReplacer:
    def response(self, flow: mitmproxy.http.HTTPFlow):
        change_response(flow)

addons = [
    LocalReplacer()
]