const enum MakerBitMotor {
  //% block="A"
  A = 0,
  //% block="B"
  B = 1,
  //% block="A + B"
  All = 2,
}

const enum MakerBitMotorRotation {
  //% block="forward"
  Forward = 1,
  //% block="backward"
  Backward = -1,
}

// MakerBit motor driver blocks
namespace makerbit {
  const motorRotations = [
    MakerBitMotorRotation.Forward,
    MakerBitMotorRotation.Forward,
  ];

  /**
   * Sets the speed of a motor.
   * @param motor motor, eg: MakerBitMotor.A
   * @param speed percentage in the range of -100 to 100, eg: 80
   */
  //% subcategory=Motors
  //% blockId="makerbit_motor_run" block="run motor %motor | at speed %speed \\%"
  //% speed.min=-100
  //% speed.max=100
  //% weight=90
  export function runMotor(motor: MakerBitMotor, speed: number): void {
    if (speed === 0) {
      stopMotor(motor);
      return;
    }

    const absSpeedPercentage = Math.min(Math.abs(speed), 100);
    const analogSpeed = pins.map(absSpeedPercentage, 0, 100, 0, 1023);

    if (motor === MakerBitMotor.A || motor === MakerBitMotor.All) {
      const isClockwise = speed * motorRotations[MakerBitMotor.A] > 0;
      pins.digitalWritePin(DigitalPin.P11, isClockwise ? 1 : 0);
      pins.digitalWritePin(DigitalPin.P12, isClockwise ? 0 : 1);
      if (speed === 100) {
        // Avoid PWM whenever possible as only 3 concurrent PWM outputs are available on the microbit
        pins.digitalWritePin(DigitalPin.P13, 1);
      } else {
        pins.analogWritePin(AnalogPin.P13, analogSpeed);
      }
    }

    if (motor === MakerBitMotor.B || motor === MakerBitMotor.All) {
      const isClockwise = speed * motorRotations[MakerBitMotor.B] > 0;
      pins.digitalWritePin(DigitalPin.P15, isClockwise ? 1 : 0);
      pins.digitalWritePin(DigitalPin.P16, isClockwise ? 0 : 1);
      if (speed === 100) {
        // Avoid PWM whenever possible as only 3 concurrent PWM outputs are available on the microbit
        pins.digitalWritePin(DigitalPin.P14, 1);
      } else {
        pins.analogWritePin(AnalogPin.P14, analogSpeed);
      }
    }
  }

  /**
   * Stops a motor.
   * @param motor motor, eg: MakerBitMotor.A
   */
  //% subcategory=Motors
  //% blockId="makerbit_motor_stop" block="stop motor %motor"
  //% weight=89
  export function stopMotor(motor: MakerBitMotor): void {
    if (motor === MakerBitMotor.A || motor === MakerBitMotor.All) {
      pins.digitalWritePin(DigitalPin.P11, 0);
      pins.digitalWritePin(DigitalPin.P12, 0);
      pins.digitalWritePin(DigitalPin.P13, 0);
    }

    if (motor === MakerBitMotor.B || motor === MakerBitMotor.All) {
      pins.digitalWritePin(DigitalPin.P15, 0);
      pins.digitalWritePin(DigitalPin.P16, 0);
      pins.digitalWritePin(DigitalPin.P14, 0);
    }
  }

  /**
   * Sets the rotation direction of a motor. Use this function at start time to configure your motors without the need to rewire.
   * @param motor motor, eg: MakerBitMotor.A
   * @param rotation rotation of the motor, eg: MakerBitMotorRotation.Forward
   */
  //% subcategory=Motors
  //% blockId=makerbit_motor_set_rotation block="set motor %motor rotation | to %rotation"
  //% weight=88
  export function setMotorRotation(
    motor: MakerBitMotor,
    rotation: MakerBitMotorRotation
  ) {
    if (motor === MakerBitMotor.A || motor === MakerBitMotor.All) {
      motorRotations[MakerBitMotor.A] = rotation;
    }

    if (motor === MakerBitMotor.B || motor === MakerBitMotor.All) {
      motorRotations[MakerBitMotor.B] = rotation;
    }
  }
}
