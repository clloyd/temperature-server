const huejay = require('huejay');


function Temperature(username, sensorId) {
    this.client = undefined;
    this.username = username;
    this.sensorId = sensorId;

    this._fetchTempFromSensors = () => {
        return this.client.sensors.getAll()
            .then(sensors => {
                const tempSensors = sensors.filter((sensor) => sensor.type === "ZLLTemperature")

                const activeSensors = tempSensors.filter(sensor => sensor.config.attributes.attributes.on);
                const matchingSensor = tempSensors.filter(sensor => sensor.attributes.attributes.uniqueid === this.sensorId)[0]
                if (!matchingSensor) {
                    return Promise.reject("Could not find a sensor");
                }

                return Promise.resolve(matchingSensor.state.attributes.attributes.temperature / 100);
            });      
    }
}

Temperature.prototype.init = function() {
    return huejay.discover()
        .then(bridges => {
            this.client = new huejay.Client({
                host:     bridges[0].ip,
                username: this.username
            });
        });
}

Temperature.prototype.getTemperatures = function() {
    if (!this.client) {
        return this.init()
            .then(() => this._fetchTempFromSensors());
    }

    return this._fetchTempFromSensors();
}

module.exports = Temperature;