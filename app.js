var express = require('express');
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');
var dotenv = require('dotenv').config();
var fs = require('fs');

var index = require('./routes/index');
var camera = require('./routes/camera');

var app = express();

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
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/camera', camera);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: process.env.NODE_ENV === 'development' ? err : {}
    });
});

app.listen(process.env.PORT || 3002, function () {
    console.log('app listening on port ' + this.address().port);
});

module.exports = app;
