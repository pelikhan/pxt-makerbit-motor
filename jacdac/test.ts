let speed = 0
let dv = 5
forever(() => {
    modules.makerbitMotorA.run(speed)
    modules.makerbitMotorB.run(- speed)

    speed += dv
    if (speed > 100) {
        dv = -5
    } else if (speed < -100) {
        dv = 5
    }
    //led.plotBarGraph(Math.abs(speed), 100)
    pause(250)    
})