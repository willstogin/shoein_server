#include <string.h>

bool wasDark = false;
bool connected = false;
int lightPin = 0;
int inClock = 8;
int inPin = 9;
int outClock = 10;
int outPin = 11;
int connIn = 12;
int connOut = 13;
char SHOE = 1;
byte x = 42;

const int uniqueID = 1337;
byte permanentKeyPair[80];
int tempKey = 0;

const String REQUEST_CHALLENGE_MESSAGE = "I would like a challenge, thank you.";
const String REQUEST_ID_MESSAGE = "ID";
const String REQUEST_TMPKEY_KEY = "tempKey";
const String REQUEST_PERMKEY_KEY = "permKey";

void checkLight() {
  bool isLight = analogRead(lightPin) > 1000;
  if (wasDark && isLight)
    tempKey++;
   wasDark = !isLight;
}

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
  bool old = connected;
  connected = (digitalRead(connIn) == HIGH);
  //if (old != connected) delay(100);
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
  int delay = 10000; // 100 corresponds to 9600 baud
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
    updateConnection();
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
  sendByteBuffer("abutts");

  String tmp = "a";
  tmp.concat(tempKey);
  sendByteBuffer(tmp);
  

  sendByteBuffer("apermkey");

  //sendByteBuffer("\n");
  // Await a response
  byte buffer[80];
  getByteBuffer(buffer, 80);
  Serial.println(String((char*)buffer));
}

void onMatConnect() {
  byte request[80];
  byte ID[80];
  byte tempKey[80];
  byte permKey[80];
  //shoe sends REQUEST_ID_MESSAGE
  
  getByteBuffer(ID, 80); //get ID
  
  getByteBuffer(tempKey, 80);//get tempkey
 
  getByteBuffer(permKey, 80);//get permkey
  
  Serial.print("ID is:");
  Serial.println(String((char*)ID));

  Serial.print("Temp Key is:");
  Serial.println(String((char*)tempKey));

  Serial.print("Perm Key is:");
  Serial.println(String((char*)permKey));

  /**
     Things Mat should do:
      ~"log \n" next line will have pc client print to console
      ~"request challenge \n" to request challenge
      ~next 3 things are uid \n, permpk \n, temppk\n
      ~after sending these 3, wait for client to give one of 3
          -"challenge response" (2 lines, one for each key, perm then temp) 
          -"discard" -> no challenge coming back
*/
}

/* ************************** LOOP FOR MAT ******************************** */
void matLoop() {
  while (!connected) {
    updateConnection();
    //Serial.println("Not connected...");
  }
  delay(500);
  onMatConnect();
  while (connected) {
    updateConnection();
  }
  Serial.println("shoe disconnected");
  delay(1000);

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
      delay(2000);
      onShoeConnect();
      checkLight();
  }
}


