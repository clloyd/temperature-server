const Temperature = require('./src/temp.js');
const secrets = require('./secret.js');

const temp = new Temperature(secrets.username);

temp.getTemperatures()
    .then(t => console.log(t))
    .catch(err => console.error(err));