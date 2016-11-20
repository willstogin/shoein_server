#include <string.h>

bool connected = false;
int inClock = 8;
int inPin = 9;
int outClock = 10;
int outPin = 11;
int connIn = 12;
int connOut = 13;
char SHOE = 0;
byte x = 42;

const int uniqueID = 1337;
byte permanentKeyPair[80];
byte tempKeyPair[80];

const String REQUEST_CHALLENGE_MESSAGE = "I would like a challenge, thank you.";
const String REQUEST_ID_KEY = "ID";
const String REQUEST_TMPKEY_KEY = "tempKey";
const String REQUEST_PERMKEY_KEY = "permKey";


void setup() {
  // put your setup code here, to run once:
  //i made a change
  Serial.begin(9600);
  pinMode(outPin, OUTPUT);
  pinMode(inPin, INPUT);
  pinMode(inClock, INPUT);
  pinMode(outClock, OUTPUT);
  pinMode(connOut, OUTPUT);
  pinMode(connIn, INPUT);
  digitalWrite(connOut, HIGH);
}

void loop() {
  if (SHOE) {
    shoeLoop();
  } else {
    matLoop(); 
  }
}
/* ************************* CHECKING FOR A CONNECTION *********************** */

void updateConnection() {
   connected = (digitalRead(connIn) == HIGH);
}

/* ********************* SENDING AND RECEIVING BITS AND BYTES  *************** */
// Reads the pin and writes the bit to the rightmost bit of char, returning result
byte getBit(byte b) {
  while(digitalRead(inClock) == LOW) {
    updateConnection();
    if(!connected) return -1;
  }
  while(digitalRead(inClock) == HIGH) {
    updateConnection();
    if(!connected) -1;
  }
  return (b << 1) | ((digitalRead(inPin) == HIGH) ? 1 : 0);  
}

// Consumes the leftmost bit and returns the resulting char
byte sendBit(byte b) {
  int delay = 100000; // 100 corresponds to 9600 baud
  digitalWrite(outClock, HIGH);
  digitalWrite(outPin, ((b & 0x80) ? HIGH : LOW));
  delayMicroseconds(delay/2); 
  digitalWrite(outClock, LOW);
  delayMicroseconds(delay/2);
  return b << 1;
}

byte getByte() {
  byte accumulator = '\0';
  for (int i=0; i<8; i++) {
    accumulator = getBit(accumulator);
    if (!connected) return -1;
   }
   Serial.println((char)accumulator);
  return accumulator;
}

void sendByte(byte b) {
  byte toSend = b;
  for (int i=0; i<8; i++) {
    toSend = sendBit(toSend);
    updateConnection();
    if (!connected) return;
  }
  Serial.println(b);
}

void getByteBuffer(byte* buffer, int size) {
  int i = 0;
  byte curByte = getByte();
  buffer[i] = curByte;
  while (connected && i < size && curByte != '\0') {
    curByte = getByte();
    buffer[++i] = curByte;
  }
}

void sendByteBuffer(String s) {
  int len = s.length();
  for (int i=0; i<=len; i++) {
    sendByte((byte) s[i]);
    if (!connected) return;
  }
  
}


/* *************************** CONNECTION HANDLER **************************** */
void onShoeConnect() {
  // Provide id, temp and perm keys
  sendByteBuffer(REQUEST_ID_KEY);
  sendByteBuffer("my id!");
  sendByteBuffer(REQUEST_TMPKEY_KEY);
  sendByteBuffer("my temp key!");
  sendByteBuffer(REQUEST_PERMKEY_KEY);
  sendByteBuffer("my perm key!");
  
  
  // Request a challenge
  sendByteBuffer(REQUEST_CHALLENGE_MESSAGE);

//  byte challenge[80];
//  getByteBuffer
  
  // Hand ID and two keys over
  // Wait for a response
}

void onMatConnect() {
  Serial.println("asdfasdf");
  byte request[80];
  byte ID[80];
  byte tempKey[80];
  byte permKey[80];
  //shoe sends REQUEST_ID_KEY
  if(String((char*) request) == REQUEST_ID_KEY) {
    Serial.println("ID key recognized");
    getByteBuffer(request, 80);
    strcpy((char*)ID, (char*)request); //Gets and saves the request should be ID
  }
  
  if(String((char*) request) == REQUEST_TMPKEY_KEY) {
    Serial.println("Tmpkey key recognized");
    getByteBuffer(request, 80);
    strcpy((char*)tempKey, (char*)request); //Gets and saves the request should be tempKey
  }
  
  if(String((char*) request) == REQUEST_PERMKEY_KEY) {
    Serial.println("Permkey key recognized");
    getByteBuffer(request, 80);
    strcpy((char*)permKey, (char*)request); //Gets and saves the request should be permKey
  }
  Serial.print("ID is: ");
  Serial.println(String((char*)ID));

  Serial.print("Temp Key is: ");
  Serial.println(String((char*)tempKey));

  Serial.print("Perm Key is: ");
  Serial.println(String((char*)permKey));
  
  //send to server at some point

  getByteBuffer(request, 80);
  Serial.println(String((char*)request));
  if (String((char*)request) == REQUEST_CHALLENGE_MESSAGE) {
    Serial.println("Challenge request received!");
  }
}

/* ************************** LOOP FOR MAT ******************************** */
void matLoop() {
  if (connected) {
    //byte b = getByte();
    byte buffer[80];
    getByteBuffer(buffer, 80);
    if (!connected) return; // Discard corrupted byte
    Serial.print("B is: ");
    for (int i=0; i<80 && buffer[i]!='\0'; i++)
      Serial.print((char) buffer[i]);
    Serial.println("Receiving...");
    updateConnection();
  } else {
    while(!connected) {
      updateConnection();
      Serial.println("Not connected...");
    }
    onMatConnect();
  }
}

/* ********************* LOOP FOR SHOE ************************************ */
void shoeLoop() {
    if (connected) {
      sendByteBuffer("Hello, World!\n");
      Serial.println("Sending...");
      updateConnection();    
    } else {
      Serial.println("Going from connected to not.");
      delay(10);
      while(!connected) { 
        Serial.println("Not connected...");
        updateConnection();
      }
      Serial.println("Connected... delaying");
      delay(5000);
      onShoeConnect();
  }
}


