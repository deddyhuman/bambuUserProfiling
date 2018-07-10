var express = require('express'),
    app = express(),
    config = require('./config/config.js')(app.get('env')),
    path = require('path'),
    logger = require('morgan'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose');

// connect to database
mongoose.connect(config.database.url);
var database = mongoose.connection;
database.on('error', console.error.bind('Database Connection Failed'));
database.once('open', function() {
    console.log('\nO===> Database Connection Established on ' + config.database.url + '\n');
    app.locals.db = database;
});

if (app.get('env') == 'production') {
    app.enable('view cache');
}

app.use(logger('dev'));
app.use(bodyParser.json({limit: '10mb'}));
app.use(bodyParser.urlencoded({limit: '10mb', extended: false }));
app.use(cookieParser());

// setting necessary configurations into app locals scope
app.locals.environment = app.get('env');
app.locals.config = config;

/**
 * load our routes and pass in our app and fully configured pass
 */
app.use('/', require('./controller/index.js'));
app.use('/user', require('./controller/user.js'));


console.log('\nO===> Start API on ' + app.get('env').toUpperCase() + ' environment ' + new Date().toString() + '\n');

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    createApiRes(req, res, 404, {}, 'Route not found');
});

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        log(err);
        return res.status(err.status || 500).json({
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    return res.status(err.status || 500).json("API V1.0.0");
});

module.exports = app;
