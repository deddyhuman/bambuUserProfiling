var dbConfig = require('../config/database.json');
var config = {
    development: {
        port: 3000,
        portSsl: 3001,
        database: {
            url: 'mongodb://' + dbConfig.development.host + '/' + dbConfig.development.database,
        },
        domain: 'https://www.localhost'
    },
    staging: {
        port: 8080,
        portSsl: 443,
        database: {
            url: 'mongodb://' + dbConfig.staging.host + ':' +  dbConfig.staging.port + '/' + dbConfig.staging.database,
        },
        domain: ''

    },
    production: {
        port: 8080,
        portSsl: 443,
        database: {
            url: 'mongodb://' + dbConfig.production.host + ':' + dbConfig.production.port + '/' + dbConfig.production.database,
        },
        domain: ''
    }
}

// get system environment (localhost, staging, or production)
module.exports = function(mode) {
    // avoid issue case sensitive server
    if (mode) {
        mode = mode.toLowerCase();
    }
    return config[mode || process.argv[2] || 'development'] || config.development;
}