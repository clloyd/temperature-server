const Temperature = require('./src/temp.js');

const temp = new Temperature();

temp.getTemperature()
    .then(t => console.log(t))
    .catch(err => console.error(err));