const express = require('express');
const router = express.Router();

const sensors = require('../sensors/sensorReader');

router.get('/', (req, res) => {

    const ds18b20 = sensors.read('DS18B20');
    const cpuTemp = sensors.read('CPU_SENSOR');

    res.render('index', {
        title: 'Sensors',
        currentDate: new Date(),
        ds18b20Value: ds18b20,
        cpuTempValue: cpuTemp
    });
});

module.exports = router;
