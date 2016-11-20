
# Note: using "pip install pyserial" wasn't sufficient. I had to run "sudo easy_install pyserial"

import serial
import time
import sys



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


if __name__ == "__main__" :
    if (len(sys.argv)!=2):
        print "Usage: read.py <serial port>"
        print "Run list_ports.py for a list of serial ports."
        exit(0)

    try:
        ser = serial.Serial(sys.argv[1],9600,timeout=0)
    except serial.serialutil.SerialException:
        print "Device not found: {0}".format(sys.argv[1])
        exit(0)

    while 1:
        print readline()
        
