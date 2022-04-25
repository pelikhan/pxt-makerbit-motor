//% deprecated
namespace makerbit { }

namespace modules {
    /**
     * Maker:bit motor 1
     */
    //% fixedInstance whenUsed block="makerbit motor A"
    export const makerbitMotorA = new MotorClient("makerbit motor A?dev=self&srvo=0")
    /**
     * Maker:bit motor 2
     */
    //% fixedInstance whenUsed block="makerbit motor B"
    export const makerbitMotorB = new MotorClient("makerbit motor B?dev=self&srvo=1")
}

namespace servers {
    class MotorServer extends jacdac.Server {
        duty = 0
        enabled = false
        motor: MakerBitMotor
        constructor(motor: MakerBitMotor) {
            super(jacdac.SRV_MOTOR)
            this.motor = motor;
            this.syncDuty()
        }

        private syncDuty() {
            if (this.duty === 0 || isNaN(this.duty) || !this.enabled) {
                makerbit.stopMotor(this.motor)
            } else {
                makerbit.setMotorRotation(
                    this.motor,
                    this.duty >= 0 ? MakerBitMotorRotation.Forward : MakerBitMotorRotation.Backward
                )
                const speed = Math.abs(this.duty) * 100
                makerbit.runMotor(this.motor, speed)
            }
        }

        handlePacket(pkt: jacdac.JDPacket) {
            this.handleRegBool(pkt, jacdac.MotorReg.Reversible, true)

            const oldEnabled = this.enabled
            const oldDuty = this.duty

            this.enabled = this.handleRegBool(pkt,
                jacdac.MotorReg.Enabled, this.enabled)
            this.duty = this.handleRegValue(pkt,
                jacdac.MotorReg.Speed,
                jacdac.MotorRegPack.Speed,
                oldDuty)

            this.syncDuty()
        }
    }

    function start() {
        jacdac.productIdentifier = 0x3cadc101
        jacdac.startSelfServers(() => [
            new MotorServer(MakerBitMotor.A),
            new MotorServer(MakerBitMotor.B),
        ])
    }
    start()
}