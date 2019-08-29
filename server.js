'use strict'

const express = require('express');
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');
const delayTime = require('./middleware/delaytime');
const successRate = require('./middleware/successrate');
const turnRouter = require('./turnExpressRouter');
const syncSwagger = require('./swaggerServer');
const { port, delayOptions, successOptions, devProxyOptions, swaggerOptions } = require('./config');

const app = express();

const isDev = process.env.NODE_ENV !== 'production';

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '/')));

turnRouter(swaggerOptions.outputPath, app);

if (isDev && devProxyOptions.turnOn) {
    const proxyMiddleware = require('http-proxy-middleware');
    Object.keys(devProxyOptions.proxyInfo).forEach(context => {
        app.use(proxyMiddleware(context, devProxyOptions.proxyInfo[context]))
    })
}

if (delayOptions.turnOn) app.use(delayTime(delayOptions.time))

if (successOptions.turnOn) app.use(successRate(successOptions.rate))

app.listen(port, err => {
    if (err) throw err;

    const serverUrl = `http://localhost:${port}`;

    console.log(`> http Ready on ${serverUrl}`)
})

syncSwagger.init(swaggerOptions)