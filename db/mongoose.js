const mongoose = require('mongoose');
exports.init = () => {
    const connectionString = process.env.DB_CONNECTION_STRING;

    mongoose.connect(connectionString, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });

    mongoose.Promise = global.Promise;

    mongoose.connection.on('connected', () => {});
    mongoose.connection.on('err', console.error);
    mongoose.connection.on('disconnected', () =>
        console.log('Mongoose connection disconnected')
    );
};
