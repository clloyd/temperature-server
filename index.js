const getTemperature = require('./src/temp.js');

getTemperature()
    .then(t => console.log(t))
    .catch(err => console.error(err));