input.onButtonPressed(Button.A, function () {
    Throttle += -5
})
input.onGesture(Gesture.Shake, function () {
    Throttle = 0
    Arm = 0
})
input.onGesture(Gesture.ScreenDown, function () {
    Throttle = 0
    Arm = 0
})
input.onButtonPressed(Button.AB, function () {
    Arm = 1 - Arm
    Throttle = 0
    Yaw = 0
})
input.onButtonPressed(Button.B, function () {
    Throttle += 5
})
pins.onPulsed(DigitalPin.P8, PulseValue.Low, function () {
    Yaw += -5
})
pins.onPulsed(DigitalPin.P12, PulseValue.Low, function () {
    Yaw += 5
})
let oldArm = 0
let oldThrottle = 0
let oldYaw = 0
let oldRoll = 0
let oldPitch = 0
let Roll = 0
let Pitch = 0
let Yaw = 0
let Throttle = 0
let Arm = 0
let radioGroup = 7
radio.setGroup(radioGroup)
basic.showNumber(radioGroup)
Arm = 0
pins.setPull(DigitalPin.P5, PinPullMode.PullUp)
pins.setPull(DigitalPin.P8, PinPullMode.PullDown)
pins.setPull(DigitalPin.P11, PinPullMode.PullUp)
pins.setPull(DigitalPin.P12, PinPullMode.PullDown)
pins.setPull(DigitalPin.P13, PinPullMode.PullDown)
pins.digitalWritePin(DigitalPin.P2, 0)
let startTime = input.runningTime()
let sendTimer = 0
let timeLimit = 100
basic.forever(function () {
    if (pins.digitalReadPin(DigitalPin.P13) == 1) {
        Pitch = input.rotation(Rotation.Pitch)
        Roll = input.rotation(Rotation.Roll)
    }
    basic.clearScreen()
    if (Arm == 1) {
        led.plot(0, 0)
    }
    led.plot(0, Math.map(Throttle, 0, 100, 4, 0))
    led.plot(Math.map(Yaw, -45, 45, 0, 4), 4)
    led.plot(Math.map(Roll, -45, 45, 0, 4), Math.map(Pitch, -45, 45, 0, 4))
    sendTimer = input.runningTime() - startTime
    if (Pitch != oldPitch || (Roll != oldRoll || Yaw != oldYaw) || (Throttle != oldThrottle || (Arm != oldArm || sendTimer > timeLimit))) {
        radio.sendString("P=" + convertToText(Pitch) + "," + ("P=" + convertToText(Roll) + ",") + ("P=" + convertToText(Yaw) + ",") + ("P=" + convertToText(Throttle) + ",") + ("P=" + convertToText(Arm)))
        oldPitch = Pitch
        oldRoll = Roll
        oldYaw = Yaw
        oldThrottle = Throttle
        oldArm = Arm
        sendTimer = 0
    }
})
