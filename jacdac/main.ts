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
    function sync(server: jacdac.ActuatorServer, motor: MakerBitMotor) {
        const speed = server.value
        const enabled = !!server.intensity
        if (speed === 0 || isNaN(speed) || !enabled) {
            makerbit.stopMotor(motor)
        } else {
            makerbit.setMotorRotation(
                motor,
                speed >= 0 ? MakerBitMotorRotation.Forward : MakerBitMotorRotation.Backward
            )
            makerbit.runMotor(motor, Math.abs(speed) * 100)
        }
    }

    function start() {
        jacdac.productIdentifier = 0x3cadc101
        jacdac.deviceDescription = "MakerBit Motor"
        jacdac.startSelfServers(() => [
            jacdac.createActuatorServer(
                jacdac.SRV_MOTOR, jacdac.MotorRegPack.Speed, jacdac.MotorRegPack.Enabled,
                (server) => sync(server, MakerBitMotor.A), { instanceName: "A" }),
            jacdac.createActuatorServer(
                jacdac.SRV_MOTOR, jacdac.MotorRegPack.Speed, jacdac.MotorRegPack.Enabled,
                (server) => sync(server, MakerBitMotor.B), { instanceName: "B" }),
        ])
    }
    start()
}