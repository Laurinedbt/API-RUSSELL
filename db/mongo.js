const mongoose = require('mongoose');

const clientOptions = {
    dbName : "api-russell"
};

exports.initClientDbConnection = async () => {
    try {
        await mongoose.connect(process.env.URL_MONGO, clientOptions)
        console.log('mongoDb connected');
    } catch (error) {
        console.log (error);
        throw error;
    }
};