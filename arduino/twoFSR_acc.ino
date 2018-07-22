/*
ref:
    http://www.arduino.cc/en/Tutorial/AnalogInOutSerial
    https://github.com/DFRobot/DFRobot_LIS2DH12

*/

#include <Wire.h>
#include <DFRobot_LIS2DH12.h>

DFRobot_LIS2DH12 LIS; //Accelerometer

// These constants won't change. They're used to give names to the pins used:
const int analogInPin1 = A0; // Analog input pin that the potentiometer is attached to
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

    Serial.println(stringOne + ';' + stringTwo);

    //
    // wait 2 milliseconds before the next loop for the analog-to-digital
    // converter to settle after the last reading:
    delay(1000);

    acceleration();
}

void acceleration(void)
{
    int16_t x, y, z;

    delay(100);
    LIS.readXYZ(x, y, z);
    LIS.mgScale(x, y, z);
    Serial.print("Acceleration x: "); //print acceleration
    Serial.print(x);
    Serial.print(" mg \ty: ");
    Serial.print(y);
    Serial.print(" mg \tz: ");
    Serial.print(z);
    Serial.println(" mg");
}