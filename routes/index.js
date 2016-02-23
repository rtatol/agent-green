var express = require('express');
var router = express.Router();

var sensors = require('../sensors/sensorReader');

router.get('/', function (req, res) {

    var ds18b20 = sensors.read('DS18B20');
    var cpuTemp = sensors.read('CPU_SENSOR');

    res.render('index', {
        title: 'agent green',
        currentDate: new Date(),
        ds18b20Value: ds18b20,
        cpuTempValue: cpuTemp
    });
});

module.exports = router;
