

const BME280 = require('bme280-sensor');

const fs = require('fs');

const FUDGE_FACTOR = 1.3

// The BME280 constructor options are optional.
// 
const options = {
  i2cBusNo   : 1, // defaults to 1
  i2cAddress : BME280.BME280_DEFAULT_I2C_ADDRESS() // defaults to 0x77
};

const bme280 = new BME280(options);

const calibratedTemperature = (temperature) => {
    const cpuTemperate = fs.readFileSync("/sys/class/thermal/thermal_zone0/temp", "utf8") / 1000
    return temperature - ((cpuTemperate - temperature) / FUDGE_FACTOR);
}

// Read BME280 sensor data, repeat
//
const getTemperature = () => {
    return bme280.readSensorData()
        .then(data => Promise.resolve(calibratedTemperature(data.temperature_C)));
};

// Initialize the BME280 sensor
//
bme280.init()
  .then(() => {
    console.log('BME280 initialization succeeded');
  })
  .catch((err) => console.error(`BME280 initialization failed: ${err} `));


module.exports = getTemperature();