/*
  Analog input, analog output, serial output

  Reads an analog input pin, maps the result to a range from 0 to 255 and uses
  the result to set the pulse width modulation (PWM) of an output pin.
  Also prints the results to the Serial Monitor.

  The circuit:
  - potentiometer connected to analog pin 0.
    Center pin of the potentiometer goes to the analog pin.
    side pins of the potentiometer go to +5V and ground
  - LED connected from digital pin 9 to ground

  created 29 Dec. 2008
  modified 9 Apr 2012
  by Tom Igoe

  This example code is in the public domain.

  http://www.arduino.cc/en/Tutorial/AnalogInOutSerial
*/

#include <Wire.h>
#include <DFRobot_LIS2DH12.h>

DFRobot_LIS2DH12 LIS; //Accelerometer

// These constants won't change. They're used to give names to the pins used:
const int analogInPin1 = A2; // Analog input pin that the potentiometer is attached to
const int analogInPin2 = A3; // Analog input pin that the potentiometer is attached to

//const int analogOutPin = 9; // Analog output pin that the LED is attached to

float sensorValue1 = 0; // value read from the pot
float sensorValue2 = 0; // value read from the pot

float outputValue1 = 0; // value output to the PWM (analog out)
float outputValue2 = 0; // value output to the PWM (analog out)

void setup()
{
    Wire.begin();

    //FSR
    Serial.begin(115200);
    pinMode(LED_BUILTIN, OUTPUT);

    //Acc
    while (!Serial)
        ;
    delay(100);

    // Set measurement range
    // Ga: LIS2DH12_RANGE_2GA
    // Ga: LIS2DH12_RANGE_4GA
    // Ga: LIS2DH12_RANGE_8GA
    // Ga: LIS2DH12_RANGE_16GA
    while (LIS.init(LIS2DH12_RANGE_8GA) == -1)
    { //Equipment connection exception or I2C address error
        Serial.println("No I2C devices found");
        delay(1000);
    }
}

void loop()
{
    // read the analog in value:
    sensorValue1 = analogRead(analogInPin1);
    sensorValue2 = analogRead(analogInPin2);

    // map it to the range of the analog out:
    outputValue1 = sensorValue1 / 1023.0;
    outputValue2 = sensorValue2 / 1023.0;

    // change the analog out value:
    analogWrite(LED_BUILTIN, outputValue1);

    // print the results to the Serial Monitor:

    String stringOne = String(outputValue1, 3);
    String stringTwo = String(outputValue2, 3);

    //  Serial.println(stringOne + ';' + stringTwo);

    //
    // wait 2 milliseconds before the next loop for the analog-to-digital
    // converter to settle after the last reading:
    delay(2); //1000

    int16_t x, y, z;

    delay(100);
    LIS.readXYZ(x, y, z);
    LIS.mgScale(x, y, z);

    Serial.println(stringOne + ';' + stringTwo + ';' + x + ';' + y + ';' + z);

    //  acceleration();
}
//
//void acceleration(void)
//{
//  int16_t x, y, z;
//
//  delay(100);
//  LIS.readXYZ(x, y, z);
//  LIS.mgScale(x, y, z);
//  Serial.print("Acceleration x: "); //print acceleration
//  Serial.print(x);
//  Serial.print(" mg \ty: ");
//  Serial.print(y);
//  Serial.print(" mg \tz: ");
//  Serial.print(z);
//  Serial.println(" mg");
//
//}