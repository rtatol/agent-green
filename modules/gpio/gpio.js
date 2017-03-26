const Gpio = require('onoff').Gpio;
const mailer = require('../mail/mailer');

function watchMotionSensor() {
    try {
        const sensor = new Gpio(22, 'in', 'both');

        setInterval(() => {
            try {
                const state = sensor.readSync();
                if (state == 1) {
                    console.log('Motion detect %s', new Date());
                    mailer.sendThrottledEmailAlert();
                }
            } catch (err) {
                console.error(err);
            }
        }, 200);

    } catch (err) {
        console.error(err);
    }
}

module.exports.watchMotionSensor = watchMotionSensor;
