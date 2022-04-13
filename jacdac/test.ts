let speed = 0
let dv = 5
forever(() => {
    modules.makerbitMotorA.setEnabled(true)
    modules.makerbitMotorB.setEnabled(true)

    modules.makerbitMotorA.setDuty(speed)
    modules.makerbitMotorB.setDuty(1 - speed)

    speed += dv
    if (speed > 100) {
        dv = -5
    } else if (speed < -100) {
        dv = 5
    }
    led.plotBarGraph(Math.abs(speed), 100)
    pause(250)    
})