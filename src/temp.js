

const BME280 = require('bme280-sensor');

const fs = require('fs');

const FUDGE_FACTOR = 0.8;

// The BME280 constructor options are optional.
// 
const options = {
  i2cBusNo   : 1, // defaults to 1
  i2cAddress : BME280.BME280_DEFAULT_I2C_ADDRESS() // defaults to 0x77
};

const calibratedTemperature = (temperature) => {
    const cpuTemperate = fs.readFileSync("/sys/class/thermal/thermal_zone0/temp", "utf8") / 1000;

    console.log("CPU: " + cpuTemperate);
    console.log("Read Temp: " + temperature);

    return temperature - ((cpuTemperate - temperature) / FUDGE_FACTOR);
}


function Temperature() {
    this.hasBeenInit = false;
    this.bme280 = new BME280(options);
}

Temperature.prototype.getTemperature = function() {

    const fetchTempFn = () => {
        return this.bme280.readSensorData()
            .then(data => Promise.resolve(calibratedTemperature(data.temperature_C)));
    }

    if (!this.hasBeenInit) {
        return this.bme280.init()
            .then(() => {
                this.hasBeenInit = true;
                return fetchTempFn();
            });
    } else {
        return fetchTempFn();
    }

}

module.exports = Temperature;