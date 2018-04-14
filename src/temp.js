const huejay = require('huejay');


function Temperature(username) {
    this.client = undefined;
    this.username = username;

    this._fetchTempFromSensors = () => {
        return this.client.sensors.getAll()
            .then(sensors => {
                const tempSensors = sensors.filter((sensor) => sensor.type === "ZLLTemperature")
                const activeSensor = tempSensors.filter((sensor) => sensor.config.attributes.attributes.on)[0];
                if (!activeSensor) {
                    return Promise.reject("Could not find a sensor");
                }

                return Promise.resolve(activeSensor.state.attributes.attributes.temperature / 100);
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