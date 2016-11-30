'use strict'
const config = {
	DB_PATH: 'mongodb://127.0.0.1:27017/Spider'
}

const mongoose = require('mongoose');
let options = {
    server: {
        auto_reconnect: true,
        poolSize: 5
    }
};

mongoose.connect(config.DB_PATH, options, function (err) {
    if(err) {
        throw err;
    }
    console.log('====== conntected ======');
});

exports.mongoose = mongoose;