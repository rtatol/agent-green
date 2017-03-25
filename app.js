const express = require('express');
const path = require('path');
const logger = require('morgan');
const bodyParser = require('body-parser');
const dotEnv = require('dotenv');
const fs = require('fs');

// routes
const index = require('./routes/index');
const camera = require('./routes/camera');
const settings = require('./routes/settings');

// modules
const gpio = require('./modules/gpio/gpio');

const app = express();

// load env variables
dotEnv.config();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// logging
app.use(logger('dev'));
app.use(logger('common', {
    stream: fs.createWriteStream('access.log', {
        flags: 'a'
    })
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public'), {
    maxAge: 24 * 60 * 60 * 1000
}));

app.use('/', index);
app.use('/camera', camera);
app.use('/settings', settings);

// catch 404 and forward to error handler
app.use((req, res, next) => {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers
app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: process.env.NODE_ENV === 'development' ? err : {}
    });
});

app.listen(process.env.PORT || 3002, function () {
    console.log('app listening on port ' + this.address().port);
    gpio.watchMotionSensor();
});

module.exports = app;
