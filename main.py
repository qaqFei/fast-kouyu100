import os
import os.path
import time
from threading import Thread
from sys import argv

import webview
import json5 as json

try:
    DOMAIN = argv[argv.index("--domain") + 1]
except (ValueError, IndexError):
    print("请指定口语100学校domain, 例如: --domain xxxxxx")
    raise SystemExit

if not (os.path.exists("users.json") and os.path.isfile("users.json")):
    print("请设置用户信息, 保存在 ./users.json 中")
    raise SystemExit

os.popen(f"set kouyu100-domain={DOMAIN} && start mitmweb --no-web-open-browser -s proxy.py")
input("请设置系统代理后继续...")

window = webview.create_window(
    title = "fast kouyu100",
    url = "about:blank"
)

index_url = f"https://my7.kouyu100.com/{DOMAIN}/index.jsp"

def process_string(s: str):
    return f"'{s.replace("\\", "\\\\").replace("'", "\\'").replace("\"", "\\\"")}'"

def goto_url(url: str):
    window.load_url("about:blank")
    window.load_url(url)
    wait_load()

def wait_load():
    window.evaluate_js("null;")

def back():
    print("等待进入主界面...")
    
    goto_url(index_url)
    while not window.evaluate_js("document.querySelector('#logo img');"): # 等待加载
        time.sleep(1 / 15)

def load_script(name: str):
    return open(f"./{name}", "r", encoding="utf-8").read()

def fast_kouyu100(un: str, pwd: str):
    back()
    
    islogined = window.evaluate_js("document.querySelectorAll('#sddm li a');")
    if islogined: # 如果登录就是有长度的 list, 否则是空 list 或 None
        print("退出登录状态...")
        window.evaluate_js("const buts = document.querySelectorAll('#sddm li a'); buts[buts.length - 1].click();")
    
        while not window.evaluate_js("document.querySelector('#btnAutoLogin');"): # 等待回到登录页
            time.sleep(1 / 15)
    
    print("登录...")
    window.evaluate_js(load_script("./fast-kouyu100-login.js") + f"\nlogin({process_string(DOMAIN)}, {process_string(un)}, {process_string(pwd)});")
    while not window.evaluate_js("logined;"): # 等待登录
        time.sleep(1 / 15)
    
    goto_url(index_url)
        
    print(f"{un} 登录请求已发送")
    
    while not window.evaluate_js("document.querySelector('.hjzy');"): # 等待加载, tip: 若有从未布置过的学生, 这里会卡死
        if window.evaluate_js("document.querySelector('#btnAutoLogin');"):
            print(f"{un} 账号或密码错误")
            return
        
        time.sleep(1 / 15)
    
    while True:
        if window.evaluate_js(load_script("./fast-kouyu100-gethw.js") + "\ngethw();") == "nohw":
            print(f"{un} 没有/已完成作业")
            return
        
        print(f"{un} 有作业")
    
        print("获取作业...")
        window.evaluate_js("gethw_items();")
        while True:
            hw_items = window.evaluate_js("homework;")
            if hw_items is not None:
                break
            time.sleep(1 / 15)
        
        print(f"得到作业, 数量: {len(hw_items)}, 开始处理作业...")

        for i, (hw_name, hw_url) in enumerate(hw_items):
            print(f"正在处理作业: {i + 1}. {hw_name}")
            goto_url(hw_url)
            window.evaluate_js(load_script("./fast-kouyu100-checker.js"))
            
            match hw_name:
                case "跟读":
                    checker_fn = "gendu_checker"
                    checker_rn = "checker_status.gendu"
                
                case "单词两分钟":
                    checker_fn = "w2m_checker"
                    checker_rn = "checker_status.w2m"
                
                case "看词选图":
                    checker_fn = "cpbw_checker"
                    checker_rn = "checker_status.cpbw"
                
                case _:
                    print(f"未知作业类型: {hw_name}")
                    continue
        
            window.evaluate_js(f"{checker_fn}();")
            while not window.evaluate_js(f"{checker_rn};"): # 等待作业完成
                time.sleep(1 / 15)
            
            print(f"作业处理完成: {i + 1}. {hw_name}")
            back()
    
def worker():
    for user in json.load(open("./users.json", "r", encoding="utf-8")):
        print(f"正在处理用户: {user["un"]}")
        fast_kouyu100(user["un"], user["pwd"])
        print(f"用户: {user["un"]} 处理完成")
    
    print("所有用户处理完成")

Thread(target=worker, daemon=True).start()
webview.start(debug="--debug" in argv)