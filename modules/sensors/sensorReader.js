const fs = require('fs');

const sensors = {
    'DS18B20': readDs18b20Sensor,
    'CPU_SENSOR': readCpuSensor
};

function read(sensor) {
    return sensors[sensor]();
}

function readDs18b20Sensor() {
    const valueDs18b20 = readSensorFileSync(process.env.DS18B20);

    const regexp = /t=(\d+)/;
    const match = regexp.exec(valueDs18b20);

    return match !== null ? match[1] / 1000.0 : undefined;
}

function readCpuSensor() {
    var valueCpuTemp = readSensorFileSync(process.env.CPU_SENSOR);

    return valueCpuTemp !== undefined ? valueCpuTemp / 1000 : undefined;
}

function readSensorFileSync(fileName) {
    let fileData;

    try {
        fileData = fs.readFileSync(fileName, 'utf8');
    } catch (e) {
        if (e.code === 'ENOENT') {
            console.error('File not found! Filename: %s', fileName);
        } else {
            // here be dragons
            throw e;
        }
    }

    return fileData;
}

module.exports.read = read;
