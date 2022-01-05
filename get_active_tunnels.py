#!/usr/bin/python3

import socket
import json
import pytz
from datetime import datetime
from pprint import pprint

h= "localhost"
time_fmt= "%x %X"
tunnels = None
tz = pytz.timezone("US/Eastern")

with open("/home/adam/Dev/tunnel_dash/status.json","r") as f:
    tunnels= json.load(f)

for device,info in tunnels.items():
    try:
        sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        sock.connect((h, info["port"]))
        sock.settimeout(3)

        banner = sock.recv(1024)
        if("SSH" in str(banner)):
            info["status"] = "online"
            info["last_online"] = datetime.now(tz).strftime(time_fmt)
        sock.shutdown(socket.SHUT_WR)
    except ConnectionRefusedError as e:
        info["status"] = "offline"
    except socket.timeout as e:
        info["status"] = "offline"
    except Exception as e:
        print(f"Unknown error [{device}]: {type(e)}")

print(json.dumps(tunnels, indent=4))

with open("/home/adam/Dev/tunnel_dash/status.json","w") as f:
    json.dump(tunnels,f, indent=4)


