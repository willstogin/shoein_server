
int inClock = 8;
int inPin = 9;
int outClock = 10;
int outPin = 11;

void setup() {
  // put your setup code here, to run once:
  Serial.begin(9600);
  pinMode(outPin, OUTPUT);
  pinMode(inPin, INPUT);
  pinMode(inClock, INPUT);
  pinMode(outClock, OUTPUT);
}

// Reads the pin and writes the bit to the rightmost bit of char, returning result
char getBit(char byte) {
  while(digitalRead(inClock) == HIGH);
  return (byte << 1) + ((digitalRead(inPin) == HIGH) ? 1 : 0);  
}

// Consumes the leftmost bit and returns the resulting char
char sendBit(char byte) {
  digitalWrite(outClock, HIGH);
  digitalWrite(outPin, ((byte & 0x80) ? HIGH : LOW));
  delayMicroseconds(100); // Corresponds to 9600 baud
  digitalWrite(outClock, LOW);
  return byte << 1;
}

int x = 0;
char writer = 1;
void loop() {
  if (writer) {
    
    char a = (char)x;
    for (int i=0; i<8; i++) {
      a = sendBit(a);
    }
    Serial.print("Done\n");
    x++;
  } else {
    char b = '\0';
    for (int i=0; i<8; i++) {
      b = getBit(b);
    }
    Serial.print("B is " + b + "\n");
  }
}
