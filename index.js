const Temperature = require('./src/temp.js');
const secrets = require('./secret.js');

const temp = new Temperature(secrets.username, secrets.sensorId);

const Koa = require('koa');

const app = new Koa();

app.use(async ctx => {
    ctx.body = await temp.getTemperatures();
});

app.listen(8367);
