var mock = require('mock-fs');
var expect = require("chai").expect;

var sensors = require('../../sensors/sensorReader');

describe('sensors tests', function () {

    beforeEach(function () {
        process.env.DS18B20 = '/sys/bus/w1/devices/28-000006250f36/w1_slave';
        process.env.CPU_SENSOR = '/sys/class/thermal/thermal_zone0/temp';
    });

    describe('read DS18B20', function () {
        it('should read DS18B20 sensor value and return formatted result', function test() {
            // given
            mock({
                '/sys/bus/w1/devices/28-000006250f36/w1_slave': '67 01 4b 46 7f ff 09 10 3b : crc=3b YES 67 01 4b 46 7f ff 09 10 3b t=22437'
            });
            // when
            var result = sensors.read('DS18B20');
            // then
            expect(result).to.equal(22.437);
        });
    });

    describe('read CPU sensor', function () {
        it('should read CPU_SENSOR sensor value and return formatted result', function test() {
            // given
            mock({
                '/sys/class/thermal/thermal_zone0/temp': '52000'
            });
            // when
            var result = sensors.read('CPU_SENSOR');
            // then
            expect(result).to.equal(52);
        });
    });

    afterEach(function () {
        mock.restore();
    });
});