
int inClock = 8;
int inPin = 9;
int outClock = 10;
int outPin = 11;

void setup() {
  // put your setup code here, to run once:
  //i made a change
  Serial.begin(9600);
  pinMode(outPin, OUTPUT);
  pinMode(inPin, INPUT);
  pinMode(inClock, INPUT);
  pinMode(outClock, OUTPUT);
}

<<<<<<< HEAD
// Reads the pin and writes the bit to the rightmost bit of byte1, returning result
char getBit(char byte1) {
  while(digitalRead(inClock) == LOW);
  while(digitalRead(inClock) == HIGH);

  return (byte << 1) | ((digitalRead(inPin) == HIGH) ? 1 : 0);  
=======
// Reads the pin and writes the bit to the rightmost bit of char, returning result
byte getBit(byte b) {
  while(digitalRead(inClock) == HIGH);
  return (b << 1) | ((digitalRead(inPin) == HIGH) ? 1 : 0);  
>>>>>>> 9581da7feb9d00c483cfcf6a188184ae75faa3eb
}

// Consumes the leftmost bit and returns the resulting char
byte sendBit(byte b) {
  digitalWrite(outClock, HIGH);
  digitalWrite(outPin, ((b & 0x80) ? HIGH : LOW));
  delayMicroseconds(1000000); // Corresponds to 9600 baud
  digitalWrite(outClock, LOW);
  Serial.print("Done");
  Serial.print(b);
  Serial.print("\n");
  
  return b << 1;
}

void sendByte(byte b) {
  byte toSend = b;
  for (int i=0; i<8; i++) {
    toSend = sendBit(toSend);
  }
  byte res = '\0';
  res = getBit(res);
  if (!res) {
    sendByte(b);
  }
}

int x = 0;
char writer = 0;
void loop() {
  if (writer) {//writing
    
    byte a = (byte) x;
    int c = 0;
    c += (int)a;
    for (int i=0; i<8; i++) {
      a = sendBit(a);
    }
//    Serial.print("Done");
//    Serial.print(c);
 //   Serial.print("\n");
    x++;
<<<<<<< HEAD
  } else {//reading
    char b = '\0';
=======
  } else {
    byte b = '\0';
>>>>>>> 9581da7feb9d00c483cfcf6a188184ae75faa3eb
    for (int i=0; i<8; i++) {
      b = getBit(b);
      Serial.print(b);
    }
    int c = 0;
    c = c + (int) b;
    Serial.print("C is ");
    Serial.print(c);
    Serial.print("\n");
  }
}
