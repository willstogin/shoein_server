bool connected = false;
int inClock = 8;
int inPin = 9;
int outClock = 10;
int outPin = 11;
int connIn = 12;
int connOut = 13;
char SHOE = 1;
byte x = 42;

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

/* ************************** LOOP FOR MAT ******************************** */
void matLoop() {
  if (connected) {
    byte b = getByte();
    Serial.println("B is: " + b);
    connected = (digitalRead(connIn) == HIGH);
  } else {
    while(!connected) connected = (digitalRead(connIn) == HIGH);
  }
}

/* ********************* LOOP FOR SHOE ************************************ */
void shoeLoop() {
    if (connected) {
      sendByte(x);
      connected = (digitalRead(connIn) == HIGH);    
    } else {
      while(!connected) { connected = (digitalRead(connIn) == HIGH);}
      delay(5000);
  }
}

/* ********************* SENDING AND RECEIVING BITS AND BYTES  *************** */
// Reads the pin and writes the bit to the rightmost bit of char, returning result
byte getBit(byte b) {
  while(digitalRead(inClock) == LOW);
  while(digitalRead(inClock) == HIGH);
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
  }
  return accumulator;
}

void sendByte(byte b) {
  byte toSend = b;
  for (int i=0; i<8; i++) {
    toSend = sendBit(toSend);
  }
}
