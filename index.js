const BME280 = require('bme280-sensor');

const fs = require('fs');

// The BME280 constructor options are optional.
// 
const options = {
  i2cBusNo   : 1, // defaults to 1
  i2cAddress : BME280.BME280_DEFAULT_I2C_ADDRESS() // defaults to 0x77
};

const bme280 = new BME280(options);


const calibrateData = (temperature) => {

    const cpuTemperate = fs.readFileSync("/sys/class/thermal/thermal_zone0/temp", "utf8")
    
    console.log(cpuTemperate);

    return temperature;
}

// Read BME280 sensor data, repeat
//
const readSensorData = () => {
  bme280.readSensorData()
    .then((data) => {
      // temperature_C, pressure_hPa, and humidity are returned by default.
      // I'll also calculate some unit conversions for display purposes.
      //
      data.pressure_inHg = BME280.convertHectopascalToInchesOfMercury(data.pressure_hPa);

      data.calibrated = calibrateData(data.temperature_C);
 
      console.log(`data = ${JSON.stringify(data, null, 2)}`);
      setTimeout(readSensorData, 2000);
    })
    .catch((err) => {
      console.log(`BME280 read error: ${err}`);
      setTimeout(readSensorData, 2000);
    });
};

// Initialize the BME280 sensor
//
bme280.init()
  .then(() => {
    console.log('BME280 initialization succeeded');
    readSensorData();
  })
  .catch((err) => console.error(`BME280 initialization failed: ${err} `));
