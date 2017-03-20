const mock = require('mock-fs');
const expect = require("chai").expect;

const sensors = require('../../../modules/sensors/sensorReader');

describe('sensors tests', () => {

    beforeEach(() => {
        process.env.DS18B20 = '/sys/bus/w1/devices/28-000006250f36/w1_slave';
        process.env.CPU_SENSOR = '/sys/class/thermal/thermal_zone0/temp';
    });

    describe('read DS18B20', () => {
        it('should read DS18B20 sensor value and return formatted result', () => {
            // given
            mock({
                '/sys/bus/w1/devices/28-000006250f36/w1_slave': '67 01 4b 46 7f ff 09 10 3b : crc=3b YES 67 01 4b 46 7f ff 09 10 3b t=22437'
            });
            // when
            const result = sensors.read('DS18B20');
            // then
            expect(result).to.equal(22.437);
        });
    });

    describe('read CPU sensor', () => {
        it('should read CPU_SENSOR sensor value and return formatted result', () => {
            // given
            mock({
                '/sys/class/thermal/thermal_zone0/temp': '52000'
            });
            // when
            const result = sensors.read('CPU_SENSOR');
            // then
            expect(result).to.equal(52);
        });
    });

    afterEach(() => {
        mock.restore();
    });
});