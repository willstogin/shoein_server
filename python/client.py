
# Note: using "pip install pyserial" wasn't sufficient. I had to run "sudo easy_install pyserial"

import serial
import time
import sys

import WebClient as webclient

# read and return a string from the serial port (until a newline encountered)
# does not include the newline character
# blocks until the newline is encountered
inputBuffer = ""
def readline():
    global inputBuffer
    while('\n' not in inputBuffer):
        inputBuffer += ser.readline()
    # parts is inputBuffer split at the first newline
    parts = inputBuffer.split('\n',1)
    if (len(parts[1])>0):
        inputBuffer = parts[1]
    else:
        inputBuffer = ""
    return parts[0]

def sendline(line):
    for b in bytearray(line,"UTF-8"):
        ser.write(b)

shoe_uid = ""
def event_loop():
    global shoe_uid
    while 1:
        line = readline()
        print "got line: '{0}'".format(line)
        if (line=="request challenge"):
            shoe_uid = readline()
            perm_pk = readline()
            temp_pk = readline()
            if (shoe_uid[0]!='a' or perm_pk[0]!='a' or temp_pk[0]!='a'):
                print "got garbage"
                sendline("discard");
            else:
                print "request challenge: {0} {1} {2}".format(shoe_uid,perm_pk,temp_pk)
                webclient.requestChallenge(shoe_uid,perm_pk,temp_pk)
                if (permChallenge!="" and tempChallenge!=""):
                    sendline(permChallenge)
                    sendline(tempChallenge)
                else:
                    sendline("garbage")
        elif (line=="send response"):
            perm_response = readline()
            temp_response = readline()
            print "send response: {0} {1} {2}".format(shoe_uid,perm_pk,temp_pk)
            webclient.sendResponse(shoe_uid,perm_response,temp_response)
        elif (line=="shoe disconnected"):
            shoe_uid = "ERROR"
            print "shoe disconnected"
            webclient.logout()
        elif (line=="log"):
            print "log: {0}".format(readline())

if __name__ == "__main__" :
    if (len(sys.argv)!=2):
        print "Usage: client.py <serial port>"
        print "Run list_ports.py for a list of serial ports."
        exit(0)

    try:
        ser = serial.Serial(sys.argv[1],9600,timeout=0)
    except serial.serialutil.SerialException:
        print "Device not found: {0}".format(sys.argv[1])
        exit(0)

    event_loop()
    
