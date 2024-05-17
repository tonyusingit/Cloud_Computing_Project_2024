import time
import sys

import stomp

conn = stomp.Connection([('127.0.0.1', 61613)])
conn.connect()
for i in range(30):
    conn.send(body=f'test {i}', destination='/topic/12345')
    time.sleep(0.2)
    