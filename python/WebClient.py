
import urllib2

baseUrl = "http://localhost:8080"

myToken = ""
permChallenge = ""
tempChallenge = ""

def connect():
    global myToken
    url = "{0}/newClient".format(baseUrl)
    myToken = urllib2.urlopen(url).read()
    

def requestChallenge(uid,perm_pk,temp_pk):
    global permChallenge, tempChallenge
    print "Requesting challenge."
    url = "{0}/request_challenge?uid={1}&perm_pk={2}&temp_pk={3}&token={4}".format(baseUrl,uid,perm_pk,temp_pk,myToken)
    res = urllib2.urlopen(url).read()
    print "FROM SERVER".format(res)
    if (',' in res):
        (permChallenge,tempChallenge) = res.split(',')
    else:
        permChallenge = ""
        tempChallenge = ""

def sendResponse(uid,perm_response,temp_response):
    print "Sending response."
    url = "{0}/response?uid={1}&perm_response={2}&temp_response={3}&token={4}".format(baseUrl,uid,perm_response,temp_response,myToken)
    res = urllib2.urlopen(url).read()
    print "FROM SERVER: {0}".format(res)

def logout():
    print "Logging out"
    url = "{0}/shoeDisconnected?token={1}".format(baseUrl,myToken)
    res = urllib2.urlopen(url).read()
    print "FROM SERVER: {0}".format(res)

if __name__=="__main__":
    connect()
    print "{0}/newSession/{1}".format(baseUrl,myToken)
    print "commands: requestChallenge sendResponse logout"
    while 1:
        cmd = raw_input()
        argv = cmd.split()
        if (argv[0]=="requestChallenge"):
            if (len(argv)==4):
                requestChallenge(argv[1],argv[2],argv[3])
            else:
                print "Usage: requestChallenge uid perm_pk temp_pk"
        elif (argv[0]=="sendResponse"):
            if (len(argv)==4):
                sendResponse(argv[1],argv[2],argv[3])
            else:
                print "Usage: sendResponse uid perm_response temp_response"
        elif (argv[0]=="logout"):
            if (len(argv)==1):
                logout()
            else:
                print "Usage: logout"
